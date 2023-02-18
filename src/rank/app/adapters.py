from . import handlers
from .models import Book


class BookRepositoryInMemmory(handlers.BookRepository):

    users = {}

    def get_book_by_user(self, user_id) -> list[Book]:
        return self.users.get(user_id, [])

    def get_book_by_user_and_id(self, user_id, book_id) -> list[Book]:
        user = self.get_book_by_user(user_id)
        return [book for book in user if book.id == book_id]

    def mark_book(self, user_id, book) -> None:
        user = self.get_book_by_user(user_id)
        if book not in user:
            user.append(book)
        self.users[user_id] = user
