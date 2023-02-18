from abc import ABC, abstractmethod
from .models import Book, Trophy
from functools import reduce


class BookRepository(ABC):

    @abstractmethod
    def get_book_by_user(self, user_id: str) -> list[Book]:
        ...

    @abstractmethod
    def get_book_by_user_and_id(self, user_id: str, book_id: str) -> list[Book]:
        ...

    @abstractmethod
    def mark_book(self, user_id: str, book: Book) -> None:
        ...


def mark_book(user_id: str, book: Book, repo: BookRepository) -> None:
    repo.mark_book(user_id, book)


def get_book(user_id: str, book_id: str | None, repo: BookRepository) -> list[Book]:
    if book_id:
        return repo.get_book_by_user_and_id(user_id, book_id)

    return repo.get_book_by_user(user_id)


def get_points(book: Book) -> int:
    return 1 + (book.pages // 100)


def get_user_points(user_id: str, repo: BookRepository) -> int:
    books = get_book(user_id, None, repo)
    return sum([get_points(book) for book in books])


BOOKS_PER_TROPHY = 5


def get_user_trophies(user_id: str, repo: BookRepository) -> list[Trophy]:
    books = get_book(user_id, None, repo)

    categories = reduce(
        lambda acc, book: {
            **acc, **{category: acc.get(category, 0) + 1 for category in book.categories}},
        books,
        {}
    )

    return [Trophy(category=category) for category, count in categories.items() if count >= BOOKS_PER_TROPHY]
