from app.adapters import BookRepositoryInMemmory, PubSubInMemmory, RankRepositoryInMemmory
from app.models import Book, BookMarked, Rank, Trophy, Event, User
from app import handlers
import pytest

from test.helpers import makeBook


class PubSubMock(handlers.PubSub):
    def __init__(self):
        self.events: list[Event] = []

    def publish(self, event: Event):
        self.events.append(event)


def make_domain_book(pages=72, categories=None):
    book = makeBook()
    return Book(id=book['id'], title=book['title'], categories=categories or book['categories'], pages=pages)


def mark_books(user, repo, *books, pubsub: handlers.PubSub = PubSubMock()):
    for book in books:
        handlers.mark_book(user, book, repo, pubsub)


@pytest.mark.parametrize("pages, expected", [(72, 1), (124, 2), (350, 4)])
def test_should_return_points_for_pages(pages, expected):
    book = make_domain_book(pages)
    assert handlers.get_points(book) == expected


def test_should_publish_book_marked_event():
    user = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="John Doe")
    book = make_domain_book()
    repo = BookRepositoryInMemmory()
    pubsub = PubSubMock()

    handlers.mark_book(user, book, repo, pubsub)

    assert pubsub.events == [BookMarked(
        user=user, book_id=book.id, points=1)]


def test_should_return_user_points():
    user = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="John Doe")
    book1 = make_domain_book(72)
    book2 = make_domain_book(124)
    book3 = make_domain_book(350)

    repo = BookRepositoryInMemmory()

    mark_books(user, repo, book1, book2, book3)

    assert handlers.get_user_points(user.id, repo) == 7


def test_should_return_user_trophies():
    user = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="John Doe")
    fictionBooks = [make_domain_book(categories=["fiction"])
                    for _ in range(handlers.BOOKS_PER_TROPHY)]
    noThophy = [make_domain_book(categories=["nothophy"])
                for _ in range(handlers.BOOKS_PER_TROPHY - 1)]
    fantasyBooks = [make_domain_book(categories=["fantasy"])
                    for _ in range(handlers.BOOKS_PER_TROPHY + 1)]
    repo = BookRepositoryInMemmory()

    mark_books(user, repo, *fictionBooks, *noThophy, *fantasyBooks)

    assert handlers.get_user_trophies(user.id, repo) == [
        Trophy(category="fiction"), Trophy(category="fantasy")]


def test_should_handle_book_marked_event():
    user = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="John Doe")
    book_id = "28623396-7573-47dd-a421-5e53d20f08ac"

    bookMarked = BookMarked(user=user, book_id=book_id, points=1)
    rankRepo = RankRepositoryInMemmory()

    handlers.update_ranking(bookMarked, rankRepo)

    assert rankRepo.get_rank_by_user(user.id) == Rank(
        user=user, points=1)


def test_should_return_ranking_of_users():

    user1 = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="User 1")
    user2 = User(id="44b4e166-123e-4a55-880b-15bd316b1565", name="User 2")
    user3 = User(id="44b4e166-123e-4a55-880b-15bd316b1566", name="User 3")

    book1 = make_domain_book(72)
    book2 = make_domain_book(124)
    book3 = make_domain_book(350)

    repo = BookRepositoryInMemmory()

    rankRepo = RankRepositoryInMemmory()

    mark_books(user1, repo, book1, book2, book3, pubsub=PubSubInMemmory(handlers.EVENTS_HANDLERS, {
        'repo': repo,
        'rank_repo': rankRepo
    }))
    mark_books(user2, repo, book1, book2, pubsub=PubSubInMemmory(handlers.EVENTS_HANDLERS, {
        'repo': repo,
        'rank_repo': rankRepo
    }))
    mark_books(user3, repo, book1, pubsub=PubSubInMemmory(handlers.EVENTS_HANDLERS, {
        'repo': repo,
        'rank_repo': rankRepo
    }))

    assert handlers.get_ranking(rankRepo) == [
        Rank(user=user1, points=7),
        Rank(user=user2, points=3),
        Rank(user=user3, points=1)
    ]


def test_should_handle_book_marked_event_with_existing_rank():
    user = User(id="44b4e166-123e-4a55-880b-15bd316b1564", name="John Doe")
    book_id = "28623396-7573-47dd-a421-5e53d20f08ac"

    bookMarked = BookMarked(user=user, book_id=book_id, points=1)
    rankRepo = RankRepositoryInMemmory()

    handlers.update_ranking(bookMarked, rankRepo)
    handlers.update_ranking(bookMarked, rankRepo)

    assert rankRepo.get_rank_by_user(user.id) == Rank(
        user=user, points=2)
