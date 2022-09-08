use crate::domain::book::Book;
use actix_web::Responder;

use crate::entrypoint::dtos::{BookResponse, Query};
use crate::services::list_books::{handle_list_books, BookRepository};
use actix_web::web;

pub struct FakeBookRepository {
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

pub async fn list_books(
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
