from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from jose import JWTError, jwt
import uvicorn


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


SECRET_KEY = "secret"
ALGORITHM = "HS256"


def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    return user.get("sub")


class MarkBookRequest(BaseModel):
    id: str = Field(..., example="bfe4a8fd")
    title: str = Field(min_length=1, example="Book 1")
    categories: list[str] = Field(..., example=["fiction", "science fiction"])
    pages: int = Field(gte=0, example=100)


app = FastAPI(
    root_path="/rank",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

users = {}


@app.get("/app")
def read_main(request: Request, token: str = Depends(get_current_user)):
    return {"message": "Hello World", "root_path": request.scope.get("root_path"), "token": token}


@app.post("/books/user/mark")
async def mark_book(request: MarkBookRequest, user_id: str = Depends(get_current_user)):

    user = users.get(user_id, [])

    if request.dict() not in user:
        user.append(request.dict())
        users[user_id] = user

    return {"message": "Book marked"}


@app.get("/books/user")
async def books(book_id: str = Query(None), user_id: str = Depends(get_current_user)):
    user = users.get(user_id, [])
    if book_id:
        return [book for book in user if book["id"] == book_id]
    return user


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000,
                log_level="info", reload=True)
