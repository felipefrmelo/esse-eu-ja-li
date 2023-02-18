from dataclasses import dataclass


@dataclass
class Book:
    id: str
    title: str
    categories: list[str]
    pages: int


@dataclass
class Trophy:
    category: str
