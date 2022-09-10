use crate::adapters::book_repository::GoogleBookRepository;
use actix_web::Responder;

use crate::entrypoint::dtos::{BookResponse, Query};
use crate::services::list_books::{handle_list_books};
use actix_web::web;

pub async fn list_books(
    query: web::Query<Query>,
    book_repos: web::Data<GoogleBookRepository>,
) -> impl Responder {
    let conn = book_repos.get_ref();

    let default_query = &"".to_string();
    let text = query.text.as_ref().unwrap_or(default_query);

    let books = handle_list_books(&text, conn);
    let books_response: Vec<BookResponse> = books
        .await
        .iter()
        .map(|b| BookResponse::from_domain(b))
        .collect();

    web::Json(books_response)
}
