from dataclasses import dataclass


class Event:
    pass


@dataclass
class Book:
    id: str
    title: str
    categories: list[str]
    pages: int


@dataclass
class Trophy:
    category: str


@dataclass
class User:
    id: str
    name: str


@dataclass
class Rank:
    user: User
    points: int


@dataclass
class BookMarked(Event):
    user: User
    book_id: str
    points: int
