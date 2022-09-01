use crate::adapters::{generate_jwt, password_hash, user_repository::UserRepositoryInMemory};
use crate::domain::token::Token;
use crate::domain::user::User;
use crate::services::login;
use crate::services::login::UserRepository;
use actix_web::{
    body::MessageBody,
    dev::{ServiceFactory, ServiceRequest, ServiceResponse},
    web, App, Error, HttpResponse, HttpServer,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
struct TokenResponse {
    access_token: String,
}

impl TokenResponse {
    fn from_domain(token: Token) -> Self {
        TokenResponse {
            access_token: token.access_token,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum MyError {
    Unauthorized(String),
}

async fn auth(
    login_request: web::Json<LoginRequest>,
    repo: web::Data<UserRepositoryInMemory>,
) -> HttpResponse {
    let conn = repo.get_ref();

    match login::handle(
        &login_request.email,
        &login_request.password,
        generate_jwt::encode,
        conn,
    ) {
        Ok(token) => {
            return HttpResponse::Ok().json(TokenResponse::from_domain(token));
        }
        Err(_) => {
            return HttpResponse::Unauthorized()
                .json(MyError::Unauthorized("Invalid Crendetias".to_string()))
        }
    };
}

fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/auth", web::post().to(auth));
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

    App::new().app_data(web::Data::new(repo)).configure(config)
}

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    HttpServer::new(app).bind(("127.0.0.1", 8080))?.run().await
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{http, test};

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
