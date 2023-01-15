from fastapi.testclient import TestClient
import random

from .main import app

client = TestClient(app)


def mark_book(book, user_id=1):
    response = client.post(f"/books/user/{user_id}/mark/", json=book)
    return response


def makeBook(): return {
    "id": random.randint(1, 100),
    "title": f'Book {random.randint(1, 100)}',
    "categories": ["fiction", "science fiction"],
    "pages": random.randint(1, 1000),
}


def test_mark_book():
    request = makeBook()

    response = mark_book(request)

    assert response.status_code == 200


def test_mark_and_get_book_by_user():
    request = makeBook()

    user_id = random.randint(2, 10000)
    response = mark_book(request, user_id=user_id)

    response = client.get(f"/books/user/{user_id}")

    assert response.status_code == 200
    assert response.json() == [request]


def test_mark_and_get_book_by_user_and_id():
    book1 = makeBook()
    book2 = makeBook()

    user_id = random.randint(2, 10000)

    response = mark_book(book1, user_id=user_id)
    response = mark_book(book2, user_id=user_id)

    response = client.get(f"/books/user/{user_id}?book_id={book1['id']}")

    assert response.status_code == 200
    assert response.json() == [book1]


def test_should_not_mark_book_duplicate():
    request = makeBook()

    user_id = random.randint(2, 10000)
    response = mark_book(request, user_id=user_id)
    response = mark_book(request, user_id=user_id)

    response = client.get(f"/books/user/{user_id}")

    assert response.status_code == 200

    assert len(response.json()) == 1
