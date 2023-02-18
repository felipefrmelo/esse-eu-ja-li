from app.adapters import BookRepositoryInMemmory
from app.models import Book
from app import handlers
import pytest

from test.helpers import makeBook


def book_with_pages(pages):
    book = makeBook()
    return Book(id=book['id'], title=book['title'], categories=book['categories'], pages=pages)


@pytest.mark.parametrize("pages, expected", [(72, 1), (124, 2), (350, 4)])
def test_should_return_points_for_pages(pages, expected):
    book = book_with_pages(pages)
    assert handlers.get_points(book) == expected


def test_should_return_user_points():
    user_id = "44b4e166-123e-4a55-880b-15bd316b1564"
    book1 = book_with_pages(72)
    book2 = book_with_pages(124)
    book3 = book_with_pages(350)

    repo = BookRepositoryInMemmory()

    handlers.mark_book(user_id, book1, repo)
    handlers.mark_book(user_id, book2, repo)
    handlers.mark_book(user_id, book3, repo)

    assert handlers.get_user_points(user_id, repo) == 7
