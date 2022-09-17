#[derive(Clone)]
pub struct Book {
    pub id: String,
    pub title: String,
    pub description: String,
    pub image: String,
}

impl Book {
    pub fn new(id: String, title: String, description: String, image: String) -> Self {
        Book {
            id,
            title,
            description,
            image,
        }
    }
}
