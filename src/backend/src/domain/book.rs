#[derive(Clone)]
pub struct Book {
    pub id: String,
    pub title: String,
    pub description: String,
    pub image: String,
    pub publisher: String,
    pub published_date: String,
    pub pages: i32,
    pub categories: Vec<String>,
    pub authors: Vec<String>,
}

impl Book {
    pub fn new(
        id: String,
        title: String,
        description: String,
        image: String,
        publisher: String,
        published_date: String,
        pages: i32,
        categories: Vec<String>,
        authors: Vec<String>,
    ) -> Self {
        Self {
            id,
            title,
            description,
            image,
            publisher,
            published_date,
            pages,
            categories,
            authors,
        }
    }
}
