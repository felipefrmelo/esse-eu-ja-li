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

fn app() -> App<
    impl ServiceFactory<
        ServiceRequest,
        Response = ServiceResponse<impl MessageBody>,
        Config = (),
        InitError = (),
        Error = Error,
    >,
> {
    let repo = UserRepositoryInMemory::new(vec![User::new(
        "test@test.com",
        &password_hash::hash("123456"),
        "test",
    )]);

    let cors = Cors::default()
        .allowed_origin(format!(
            "http://{}",
            env::var("HOST").expect("FRONTEND_HOST not set")
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

    use crate::entrypoint::dtos::{LoginRequest, TokenResponse};

    #[actix_web::test]
    async fn test_should_login_user_correcty() {
        let mut app = test::init_service(app()).await;

        let payload = LoginRequest {
            email: "test@test.com".to_string(),
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
    }

    #[actix_web::test]
    async fn test_should_return_a_error_when_have_invalid_credentials_email() {
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
}
