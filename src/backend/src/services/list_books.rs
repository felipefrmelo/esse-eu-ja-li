use crate::domain::book::Book;

trait BookRepository {
    fn get_books_by_text(&self, query: &str) -> Vec<Book>;
}

fn handle_list_books(query: &str, repository: &impl BookRepository) -> Vec<Book> {
    repository.get_books_by_text(query)
}

#[cfg(test)]
mod tests {
    use super::*;

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

    fn make_books(quantity: u16) -> Vec<Book> {
        (0..quantity)
            .map(|i| {
                Book::new(
                    format!("id {}", i + 1),
                    format!("book {}", i + 1),
                    format!("description {}", i + 1),
                    format!("image {}", i + 1),
                )
            })
            .collect()
    }

    #[test]
    fn should_list_books() {
        let repo = FakeBookRepository::new(make_books(5));
        let query = "book";

        let books: Vec<Book> = handle_list_books(query, &repo);

        let book = books.first();

        assert!(book.is_some());
        let book = book.unwrap();

        assert_eq!(book.id, "id 1".to_string());
        assert_eq!(book.title, "book 1".to_string());
        assert_eq!(book.description, "description 1".to_string());
        assert_eq!(book.image, "image 1".to_string());
    }
}
