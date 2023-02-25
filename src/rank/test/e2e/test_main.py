
from fastapi.testclient import TestClient
import random

from app.main import app, get_current_user
from app.models import User
from test.helpers import makeBook

client = TestClient(app)


def mark_book(book, user_id='1'):

    app.dependency_overrides[get_current_user] = lambda: User(
        id=user_id, name="User 1")
    response = client.post(f"/books/user/mark", json=book)
    return response


def make_user_id():
    user_id = random.randint(2, 10000)
    return str(user_id)


def test_mark_book():
    request = makeBook()

    response = mark_book(request)

    assert response.status_code == 200


def test_mark_and_get_book_by_user():
    request = makeBook()

    user_id = make_user_id()
    response = mark_book(request, user_id=user_id)

    response = client.get(f"/books/user")

    assert response.status_code == 200
    assert response.json() == [request]


def test_mark_and_get_book_by_user_and_id():
    book1 = makeBook()
    book2 = makeBook()

    user_id = make_user_id()

    response = mark_book(book1, user_id=user_id)
    response = mark_book(book2, user_id=user_id)

    response = client.get(f"/books/user?book_id={book1['id']}")

    assert response.status_code == 200
    assert response.json() == [book1]


def test_should_not_mark_book_duplicate():
    request = makeBook()

    user_id = make_user_id()
    response = mark_book(request, user_id=user_id)
    response = mark_book(request, user_id=user_id)

    response = client.get(f"/books/user")

    assert response.status_code == 200

    assert len(response.json()) == 1


def test_should_get_user_points():
    request = makeBook()
    request["pages"] = 72

    user_id = make_user_id()
    mark_book(request, user_id=user_id)

    response = client.get(f"/users/points")

    assert response.status_code == 200
    assert response.json() == 1


def test_should_get_user_trophies():
    requests = [makeBook() for _ in range(5)]
    requests = [{**request, "categories": ['fiction']} for request in requests]

    user_id = make_user_id()
    for request in requests:
        mark_book(request, user_id=user_id)

    response = client.get(f"/users/trophies")

    assert response.status_code == 200
    assert response.json() == [{
        'category': 'fiction',
    }]


def test_should_get_users_ranking():
    user_id = make_user_id()
    for _ in range(5):
        request = makeBook()
        request["pages"] = 1000000000
        mark_book(request, user_id=user_id)

    response = client.get(f"/users/ranking", params={"qnt": 1})

    assert response.status_code == 200
    assert response.json() == [{
        'user': {
            'id': user_id,
            'name': 'User 1',
        },
        'points': 50000005,
    }]
