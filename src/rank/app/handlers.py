from abc import ABC, abstractmethod
from typing import Type, Callable
from .models import Book, BookMarked, Event, Rank, Trophy, User
from functools import reduce


BOOKS_PER_TROPHY = 5


class PubSub(ABC):

    @abstractmethod
    def publish(self, event: Event) -> None:
        ...


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


class RankRepository(ABC):

    @abstractmethod
    def get_rank_by_user(self, user_id: str) -> Rank:
        ...

    @abstractmethod
    def save_rank(self, rank: Rank) -> None:
        ...

    @abstractmethod
    def get_ranking(self) -> list[Rank]:
        ...


def mark_book(user: User, book: Book, repo: BookRepository, pubsub: PubSub) -> None:
    repo.mark_book(user.id, book)
    pubsub.publish(BookMarked(user=user,
                   book_id=book.id, points=get_points(book)))


def get_book(user_id: str, book_id: str | None, repo: BookRepository) -> list[Book]:
    if book_id:
        return repo.get_book_by_user_and_id(user_id, book_id)

    return repo.get_book_by_user(user_id)


def get_points(book: Book) -> int:
    return 1 + (book.pages // 100)


def get_user_points(user_id: str, repo: BookRepository) -> int:
    books = get_book(user_id, None, repo)
    return sum([get_points(book) for book in books])


def get_user_trophies(user_id: str, repo: BookRepository) -> list[Trophy]:
    books = get_book(user_id, None, repo)

    categories = reduce(
        lambda acc, book: {
            **acc, **{category: acc.get(category, 0) + 1 for category in book.categories}},
        books,
        {}
    )

    return [Trophy(category=category) for category, count in categories.items() if count >= BOOKS_PER_TROPHY]


def update_ranking(event: BookMarked, rank_repo: RankRepository) -> None:
    rank = rank_repo.get_rank_by_user(event.user.id)
    print(event)
    if rank is None:
        rank = Rank(user=event.user, points=0)

    rank.points += event.points

    rank_repo.save_rank(rank)


def get_ranking(rank_repo: RankRepository, top: int = 5) -> list[Rank]:
    print(rank_repo.get_ranking())
    return sorted(rank_repo.get_ranking(), key=lambda rank: rank.points, reverse=True)[:top]


EVENTS_HANDLERS = {
    BookMarked: [update_ranking]
}  # type: dict[Type[Event], list[Callable]]
