from fastapi import FastAPI, Query, Request
from pydantic import BaseModel, Field
import uvicorn


class MarkBookRequest(BaseModel):
    id: int = Field(gt=0, example=1)
    title: str = Field(min_length=1, example="Book 1")
    categories: list[str] = Field(..., example=["fiction", "science fiction"])
    pages: int = Field(gt=0, example=100)


app = FastAPI(
    root_path="/rank",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

users = {}


@app.get("/app")
def read_main(request: Request):
    return {"message": "Hello World", "root_path": request.scope.get("root_path")}


@app.post("/books/user/{user_id}/mark/")
async def mark_book(request: MarkBookRequest, user_id: int):

    user = users.get(user_id, [])

    if request.dict() not in user:
        user.append(request.dict())
        users[user_id] = user

    return {"message": "Book marked"}


@app.get("/books/user/{user_id}")
async def books(user_id: int, book_id: int = Query(None)):
    user = users.get(user_id, [])
    if book_id:
        return [book for book in user if book["id"] == book_id]
    return user


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000,
                log_level="info", reload=True)
