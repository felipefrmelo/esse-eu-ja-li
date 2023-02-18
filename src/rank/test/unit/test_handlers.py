from app.adapters import BookRepositoryInMemmory
from app.models import Book, Trophy
from app import handlers
import pytest

from test.helpers import makeBook


def make_domain_book(pages=72, categories=None):
    book = makeBook()
    return Book(id=book['id'], title=book['title'], categories=categories or book['categories'], pages=pages)


def mark_books(user_id, repo, *books):
    for book in books:
        handlers.mark_book(user_id, book, repo)


@pytest.mark.parametrize("pages, expected", [(72, 1), (124, 2), (350, 4)])
def test_should_return_points_for_pages(pages, expected):
    book = make_domain_book(pages)
    assert handlers.get_points(book) == expected


def test_should_return_user_points():
    user_id = "44b4e166-123e-4a55-880b-15bd316b1564"
    book1 = make_domain_book(72)
    book2 = make_domain_book(124)
    book3 = make_domain_book(350)

    repo = BookRepositoryInMemmory()

    mark_books(user_id, repo, book1, book2, book3)

    assert handlers.get_user_points(user_id, repo) == 7


def test_should_return_user_trophies():
    user_id = "44b4e166-123e-4a55-880b-15bd316b1564"
    fictionBooks = [make_domain_book(categories=["fiction"])
                    for _ in range(handlers.BOOKS_PER_TROPHY)]
    noThophy = [make_domain_book(categories=["nothophy"])
                for _ in range(handlers.BOOKS_PER_TROPHY - 1)]
    fantasyBooks = [make_domain_book(categories=["fantasy"])
                    for _ in range(handlers.BOOKS_PER_TROPHY + 1)]
    repo = BookRepositoryInMemmory()

    mark_books(user_id, repo, *fictionBooks, *noThophy, *fantasyBooks)

    assert handlers.get_user_trophies(user_id, repo) == [
        Trophy(category="fiction"), Trophy(category="fantasy")]
