use crate::domain::book::Book;
use crate::services::list_books::BookRepository;
use async_trait::async_trait;

pub struct GoogleBookRepository {}

impl GoogleBookRepository {
    pub fn new() -> Self {
        GoogleBookRepository {}
    }
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct GoogleBook {
    id: String,
    #[serde(rename = "volumeInfo")]
    volume_info: VolumeInfo,
}

impl GoogleBook {
    fn to_domain(&self) -> Book {
        Book::new(
            self.id.clone(),
            self.volume_info.title.clone(),
            self.volume_info
                .description
                .as_ref()
                .unwrap_or(&"none".to_string())
                .clone(),
            self.volume_info
                .image_links
                .as_ref()
                .unwrap_or(&ImageLinks {
                    thumbnail: "".to_string(),
                })
                .thumbnail
                .clone(),
        )
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct VolumeInfo {
    title: String,
    description: Option<String>,
    #[serde(rename = "imageLinks")]
    image_links: Option<ImageLinks>,
}

#[derive(Debug, Serialize, Deserialize)]
struct GoogleResponse {
    items: Vec<GoogleBook>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ImageLinks {
    thumbnail: String,
}

async fn get_books_google(query: &str) -> Result<GoogleResponse, reqwest::Error> {
    let res: GoogleResponse = reqwest::get(format!(
        "https://www.googleapis.com/books/v1/volumes?q={query}"
    ))
    .await?
    .json()
    .await?;

    Ok(res)
}

#[async_trait]
impl BookRepository for GoogleBookRepository {
    async fn get_books_by_text(&self, query: &str) -> Vec<Book> {
        let books: Result<GoogleResponse, reqwest::Error> = get_books_google(query).await;

        if books.is_ok() {
            return books.unwrap().items.iter().map(|b| b.to_domain()).collect();
        }

        vec![]
    }
}
