use crate::domain::book::Book;
use crate::domain::token::Token;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
}

#[derive(Serialize, Deserialize)]
pub struct BookResponse {
    pub id: String,
    pub title: String,
    pub description: String,
    pub image: String,
}

impl BookResponse {
    pub fn from_domain(book: &Book) -> Self {
        BookResponse {
            id: book.id.to_string(),
            title: book.title.to_string(),
            description: book.description.to_string(),
            image: book.image.to_string(),
        }
    }
}

#[derive(Deserialize)]
pub struct Query {
    pub text: Option<String>,
}

impl TokenResponse {
    pub fn from_domain(token: Token) -> Self {
        TokenResponse {
            access_token: token.access_token,
        }
    }
}
