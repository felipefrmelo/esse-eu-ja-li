use crate::adapters::{generate_jwt, password_hash, user_repository::UserRepositoryInMemory};
use crate::domain::book::Book;
use crate::domain::token::Token;
use crate::domain::user::User;
use crate::services::list_books::{handle_list_books, BookRepository};
use crate::services::login;
use crate::services::login::UserRepository;
use actix_cors::Cors;
use actix_web::http::StatusCode;
use actix_web::Responder;
use actix_web::{
    body::MessageBody,
    dev::{ServiceFactory, ServiceRequest, ServiceResponse},
    error,
    http::header,
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

#[derive(Serialize, Deserialize)]
struct BookResponse {
    title: String,
    description: String,
    image: String,
}

impl BookResponse {
    fn from_domain(book: &Book) -> Self {
        BookResponse {
            title: book.title.to_string(),
            description: book.description.to_string(),
            image: book.image.to_string(),
        }
    }
}

#[derive(Deserialize)]
struct Query {
    text: Option<String>,
}

impl TokenResponse {
    fn from_domain(token: Token) -> Self {
        TokenResponse {
            access_token: token.access_token,
        }
    }
}

use derive_more::Display;

#[derive(Debug, Serialize, Deserialize, PartialEq, Display)]
enum MyError {
    Unauthorized(String),
}

impl error::ResponseError for MyError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(header::ContentType::json())
            .body(self.to_string())
    }

    fn status_code(&self) -> StatusCode {
        match self {
            MyError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
        }
    }
}

async fn list_books(
    query: web::Query<Query>,
    book_repos: web::Data<FakeBookRepository>,
) -> impl Responder {
    let conn = book_repos.get_ref();

    let default_query = &"".to_string();
    let text = query.text.as_ref().unwrap_or(default_query);

    let books = handle_list_books(&text, conn);
    let books_response: Vec<BookResponse> =
        books.iter().map(|b| BookResponse::from_domain(b)).collect();

    web::Json(books_response)
}

async fn auth(
    login_request: web::Json<LoginRequest>,
    repo: web::Data<UserRepositoryInMemory>,
) -> Result<impl Responder, MyError> {
    let conn = repo.get_ref();

    match login::handle(
        &login_request.email,
        &login_request.password,
        generate_jwt::encode,
        conn,
    ) {
        Ok(token) => {
            return Ok(web::Json(TokenResponse::from_domain(token)));
        }
        Err(_) => return Err(MyError::Unauthorized("Unauthorized".to_string())),
    };
}

fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/auth", web::post().to(auth))
        .route("/books", web::get().to(list_books));
}

struct FakeBookRepository {
    books: Vec<Book>,
}

impl FakeBookRepository {
    pub fn new(books: Vec<Book>) -> Self {
        Self { books }
    }
}

impl BookRepository for FakeBookRepository {
    fn get_books_by_text(&self, _: &str) -> Vec<Book> {
        self.books.clone()
    }
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
        .allowed_origin("http://localhost:3000")
        .allowed_methods(vec!["GET", "POST"])
        .allowed_header(header::CONTENT_TYPE)
        .max_age(3600);

    let book_repo = FakeBookRepository::new(vec![Book::new(
        "1".to_string(),
        "title 1".to_string(),
        "description".to_string(),
        "image".to_string(),
    )]);

    App::new()
        .app_data(web::Data::new(repo))
        .app_data(web::Data::new(book_repo))
        .wrap(cors)
        .configure(config)
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

    #[actix_web::test]
    async fn test_should_list_books() {
        let mut app = test::init_service(app()).await;

        let res = test::TestRequest::get()
            .uri("/books?text=ola")
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::OK);

        let result: Vec<BookResponse> = test::read_body_json(res).await;

        assert_eq!(result.len(), 1);
        let book = result.first().unwrap();

        assert_eq!(book.title, "title 1");
    }

    #[actix_web::test]
    async fn test_should_list_books_with_default_query() {
        let mut app = test::init_service(app()).await;

        let res = test::TestRequest::get()
            .uri("/books")
            .send_request(&mut app)
            .await;

        assert_eq!(res.status(), http::StatusCode::OK);

        let result: Vec<BookResponse> = test::read_body_json(res).await;

        assert_eq!(result.len(), 1);
        let book = result.first().unwrap();

        assert_eq!(book.title, "title 1");
    }
}
