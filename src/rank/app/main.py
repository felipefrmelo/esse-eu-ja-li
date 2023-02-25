from .adapters import BookRepositoryInMemmory, PubSubInMemmory, RankRepositoryInMemmory
from .models import Book, User
from .auth import get_current_user
from . import handlers
from fastapi import Depends, FastAPI, Query
from pydantic import BaseModel, Field
import uvicorn


app = FastAPI(
    root_path="/rank",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


class MarkBookRequest(BaseModel):
    id: str = Field(..., example="bfe4a8fd")
    title: str = Field(min_length=1, example="Book 1")
    categories: list[str] = Field(..., example=["fiction", "science fiction"])
    pages: int = Field(gte=0, example=100)

    def to_book(self) -> Book:
        return Book(
            id=self.id,
            title=self.title,
            categories=self.categories,
            pages=self.pages,
        )


db = BookRepositoryInMemmory()


rankRepo = RankRepositoryInMemmory()


def get_repo():
    return db


def get_pubsub():
    return pubsub


def get_rank_repo():
    return rankRepo


def get_user(user: User = Depends(get_current_user)) -> User:
    return user


pubsub = PubSubInMemmory(handlers.EVENTS_HANDLERS, {"repo": get_repo(),
                                                    "get_user": get_user(),
                                                    "rank_repo": get_rank_repo()})


@app.post("/books/user/mark")
async def mark_book(request: MarkBookRequest,
                    user: User = Depends(get_current_user),
                    repo: BookRepositoryInMemmory = Depends(get_repo),
                    pubsub: PubSubInMemmory = Depends(get_pubsub)):

    book = request.to_book()

    handlers.mark_book(user, book, repo, pubsub)

    return {"message": "Book marked"}


@app.get("/books/user")
async def books(book_id: str = Query(None), user: User = Depends(get_current_user), repo: BookRepositoryInMemmory = Depends(get_repo)):

    return handlers.get_book(user.id, book_id, repo)


@app.get("/users/points")
async def user_points(user: User = Depends(get_current_user), repo: BookRepositoryInMemmory = Depends(get_repo)):
    return handlers.get_user_points(user.id, repo)


@app.get("/users/trophies")
async def user_trophies(user: User = Depends(get_current_user), repo: BookRepositoryInMemmory = Depends(get_repo)):
    return handlers.get_user_trophies(user.id, repo)


@app.get("/users/ranking")
async def users_ranking(rank_repo: RankRepositoryInMemmory = Depends(get_rank_repo), qnt: int = Query(5)):
    return handlers.get_ranking(rank_repo, qnt)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000,
                log_level="info", reload=True)
