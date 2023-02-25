import inspect
from typing import Callable
from . import handlers
from .models import Book, Event, Rank


class BookRepositoryInMemmory(handlers.BookRepository):

    def __init__(self):
        self.users = {}

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


class PubSubInMemmory(handlers.PubSub):

    def __init__(self, handlers: dict[type[Event], list[Callable]], deps):
        self.handlers = handlers
        self.deps = deps
        self.deps.update({"pubsub": self})

    def publish(self, event: Event) -> None:
        for handler in self.handlers.get(type(event), []):
            self.inject_dependencies(handler)(event)

    def inject_dependencies(self, handler) -> Callable:
        params = inspect.signature(handler).parameters
        deps = {
            name: dependency
            for name, dependency in self.deps.items()
            if name in params
        }
        return lambda event: handler(event, **deps)


class RankRepositoryInMemmory(handlers.RankRepository):

    def __init__(self):
        self.ranks = {}

    def get_rank_by_user(self, user_id) -> Rank | None:
        return self.ranks.get(user_id)

    def save_rank(self, rank: Rank) -> None:
        self.ranks[rank.user.id] = rank

    def get_ranking(self) -> list[Rank]:
        return list(self.ranks.values())
