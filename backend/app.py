from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends

try:
    from .models import (
        CheckoutCreate,
        CheckoutResponse,
        BookGenre,
        BookCreate,
        BookResponse,
    )
except ImportError:
    from models import (
        CheckoutCreate,
        CheckoutResponse,
        BookGenre,
        BookCreate,
        BookResponse,
    )

try:
    from .database import get_db
    from .db_models import Book, Checkout
except ImportError:
    from database import get_db
    from db_models import Book, Checkout

app = FastAPI(title="LibraryConnect API Starter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/books", response_model=BookResponse)
def create_book(
    payload: BookCreate,
    db: Session = Depends(get_db),
) -> BookResponse:
    book = Book(
        title=payload.title,
        genre=payload.genre.value,
        description=payload.description,
        author=payload.author,
        publisher_email=str(payload.publisher_email),
        shelf_location=payload.shelf_location,
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return book



@app.get("/books", response_model=list[BookResponse])
def list_books(
    q: str | None = None,
    genre: BookGenre | None = None,
    db: Session = Depends(get_db),
) -> list[BookResponse]:
    query = db.query(Book)

    if q:
        query = query.filter(Book.title.ilike(f"%{q}%"))

    if genre:
        query = query.filter(Book.genre == genre.value)

    return query.all()


@app.get("/books/{book_id}", response_model=BookResponse)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
) -> BookResponse:
    book = db.query(Book).filter(Book.id == book_id).first()

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return book


@app.post("/checkouts", response_model=CheckoutResponse)
def create_checkout(
    payload: CheckoutCreate,
    db: Session = Depends(get_db),
) -> CheckoutResponse:
    book = db.query(Book).filter(Book.id == payload.book_id).first()

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    checkout = Checkout(
        patron_name=payload.patron_name,
        book_id=payload.book_id,
        date=payload.date,
        notes=payload.notes,
    )

    db.add(checkout)
    db.commit()
    db.refresh(checkout)

    return checkout


@app.get("/books/{book_id}/checkouts", response_model=list[CheckoutResponse])
def list_book_checkouts(
    book_id: int,
    db: Session = Depends(get_db),
) -> list[CheckoutResponse]:
    book = db.query(Book).filter(Book.id == book_id).first()

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return db.query(Checkout).filter(Checkout.book_id == book_id).all()
