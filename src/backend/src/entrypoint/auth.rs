use crate::adapters::{generate_jwt, user_repository::UserRepositoryInMemory};
use crate::entrypoint::dtos::{LoginRequest, TokenResponse};
use crate::entrypoint::errors::MyError;

use crate::services::login;

use actix_web::Responder;

use actix_web::web;

pub async fn auth(
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
