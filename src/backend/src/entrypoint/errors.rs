use actix_web::http::StatusCode;
use actix_web::{error, http::header, HttpResponse};
use serde::{Deserialize, Serialize};

use derive_more::Display;

#[derive(Debug, Serialize, Deserialize, PartialEq, Display)]
pub enum MyError {
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
