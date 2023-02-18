from fastapi import Depends, FastAPI, Query
from pydantic import BaseModel, Field
import uvicorn

from . import handlers
from .auth import get_current_user
from .models import Book
from .adapters import BookRepositoryInMemmory


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


def get_repo():
    return db


@app.post("/books/user/mark")
async def mark_book(request: MarkBookRequest, user_id: str = Depends(get_current_user), repo: BookRepositoryInMemmory = Depends(get_repo)):

    book = request.to_book()

    handlers.mark_book(user_id, book, repo)

    return {"message": "Book marked"}


@app.get("/books/user")
async def books(book_id: str = Query(None), user_id: str = Depends(get_current_user), repo: BookRepositoryInMemmory = Depends(get_repo)):

    return handlers.get_book(user_id, book_id, repo)


@app.get("/users/{user_id}/points")
async def user_points(user_id: str, repo: BookRepositoryInMemmory = Depends(get_repo)):
    return handlers.get_user_points(user_id, repo)


@app.get("/users/{user_id}/trophies")
async def user_trophies(user_id: str, repo: BookRepositoryInMemmory = Depends(get_repo)):
    return handlers.get_user_trophies(user_id, repo)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000,
                log_level="info", reload=True)
