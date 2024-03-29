use crate::adapters::book_repository::GoogleBookRepository;
use crate::adapters::{password_hash, user_repository::UserRepositoryInMemory};
use crate::domain::user::User;
use crate::entrypoint::auth::auth;
use crate::entrypoint::books::list_books;
use crate::services::login::UserRepository;
use actix_cors::Cors;

use actix_web::{
    body::MessageBody,
    dev::{ServiceFactory, ServiceRequest, ServiceResponse},
    http::header,
    web, App, Error, HttpServer,
};

use std::env;

fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/auth", web::post().to(auth))
        .route("/books", web::get().to(list_books));
}

fn make_user(number: i32, name: &str) -> User {
    User::with_id(
        &format!("{}", number),
        &format!("test{}@test.com", number),
        &password_hash::hash("123456"),
        name,
    )
}

fn app() -> App<
    impl ServiceFactory<
        ServiceRequest,
        Response = ServiceResponse<impl MessageBody>,
        Config = (),
        InitError = (),
        Error = Error,
    >,
> {
    let repo = UserRepositoryInMemory::new(vec![
        make_user(1, "John Doe"),
        make_user(2, "Jane Smith"),
        make_user(3, "Alice Jones"),
        make_user(4, "Bob Smith"),
        make_user(5, "Charlie Brown"),
        make_user(6, "David Jones"),
        make_user(7, "Eve Smith"),
        make_user(8, "Frank Brown"),
    ]);

    let cors = Cors::default()
        .allowed_origin(&format!(
            "http://{}",
            env::var("REACT_APP_HOST").expect("REACT_APP_HOST not set")
        ))
        .allowed_methods(vec!["GET", "POST"])
        .allowed_header(header::CONTENT_TYPE)
        .max_age(3600);

    let book_repo = GoogleBookRepository::new();

    App::new()
        .app_data(web::Data::new(repo))
        .app_data(web::Data::new(book_repo))
        .wrap(cors)
        .configure(config)
}

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    HttpServer::new(app).bind(("0.0.0.0", 8080))?.run().await
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{http, test};

    use crate::entrypoint::dtos::{BookResponse, LoginRequest, TokenResponse};

    fn set_env() {
        env::set_var("REACT_APP_HOST", "localhost");
    }

    #[actix_web::test]
    async fn test_should_login_user_correcty() {
        set_env();
        let mut app = test::init_service(app()).await;

        let payload = LoginRequest {
            email: "test1@test.com".to_string(),
            password: "123456".to_string(),
        };

        let res = test::TestRequest::post()
            .uri("/auth")
            .set_json(payload)
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::OK);

        let result: TokenResponse = test::read_body_json(res).await;
        assert!(!result.access_token.is_empty());
        assert!(!result.name.is_empty());
    }

    #[actix_web::test]
    async fn test_should_return_a_error_when_have_invalid_credentials_email() {
        set_env();
        let mut app = test::init_service(app()).await;

        let payload = LoginRequest {
            email: "wrogn@test.com".to_string(),
            password: "123456".to_string(),
        };

        let res = test::TestRequest::post()
            .uri("/auth")
            .set_json(payload)
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::UNAUTHORIZED);
    }

    #[actix_web::test]
    async fn test_should_return_a_error_when_have_invalid_credentials_pass() {
        set_env();
        let mut app = test::init_service(app()).await;

        let payload = LoginRequest {
            email: "test@test.com".to_string(),
            password: "12345".to_string(),
        };

        let res = test::TestRequest::post()
            .uri("/auth")
            .set_json(payload)
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::UNAUTHORIZED);
    }

    #[actix_web::test]
    #[ignore]
    async fn test_should_return_a_list_of_books() {
        set_env();
        let mut app = test::init_service(app()).await;

        let res = test::TestRequest::get()
            .uri("/books?text=harry")
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::OK);

        let result: Vec<BookResponse> = test::read_body_json(res).await;
        assert_eq!(result.len(), 16);
    }
}
