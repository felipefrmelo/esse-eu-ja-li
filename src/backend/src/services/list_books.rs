use crate::domain::book::Book;
use async_trait::async_trait;

#[async_trait]
pub trait BookRepository {
    async fn get_books_by_text(&self, query: &str) -> Vec<Book>;
}

pub async fn handle_list_books(query: &str, repository: &impl BookRepository) -> Vec<Book> {
    repository.get_books_by_text(query).await
}
