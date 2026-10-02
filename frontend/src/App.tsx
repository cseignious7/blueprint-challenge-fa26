import { useState } from 'react'
import './App.css'
import CheckoutForm from './components/CheckoutForm'
import BookDetail from './components/BookDetail'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import { GENRES, type Genre, type Checkout, type CheckoutFormValues, type Book, type BookFormValues } from './types'
import { listBooks, getBook, createBook, createCheckout } from './api/api'
const initialBookForm: BookFormValues = {
  title: '',
  genre: 'Fiction',
  description: '',
  author: '',
  publisher_email: '',
  shelf_location: '',
}

const initialCheckoutForm: CheckoutFormValues = {
  patron_name: '',
  book_id: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookCheckouts, setBookCheckouts] = useState<Checkout[]>([])
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState<Genre | 'All'>('All')
  const [bookForm, setBookForm] = useState<BookFormValues>(initialBookForm)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormValues>(initialCheckoutForm)
  const [error, setError] = useState<string | null>(null)

/* 
Code 1 Explanation:
1. The handleLoadBooks() function begins the process of loading books
the backend. It runs when the application needs to retrieve books based
on the user's current search and genre selections.
2. setError(null) clears any previous error message. This makes sure an old
error does not continue to display when the application attempts to load the 
books again.
3. A try block is used to attempt the API request. The code inside the try block
runs normally, but if something goes wrong while retrieving the books, the program
can handle the problem instead of crashing.
4. listbooks() sends the user's search and genre information to the API. The search value
is represented as q, while genreFilter tells the backend which genre the user selected.
5. The code waits fro the backend to return the matching books. 'await' pauses this function
until the request finishes. The returned books are stored in loadedBooks.
6. setBooks(loadedBooks) updates the application's book state; saves the books returned by
the backend so React can display the matching books to the user.
7. The catch block handles a failed API request.
8. setError('Failed to load books') stores an error message for the user; communicates
that books could not be retrieved.
*/

  async function handleLoadBooks() {
    setError(null)
    try {
    const loadedBooks = await listBooks({
  q: search,
  genre: genreFilter,
})

setBooks(loadedBooks)
}
catch {
  setError('Failed to load book')
  }
}

/*
Code 2 Explanatiom:
1. handleSelectBook() runs when a user selects a book.
2. setError(null) clears an previous error message.
3. a try block attempts to load the selected book.
4. getBook(bookId) retrieves the selected book from the API
5. await waits for the book to be returned 
setSelectedBook(selected) saves the selected book
6. The catch block handles an error if the request fails.
7. setError() displays a 'Failed to load book' message if the book cannot load.
*/

  async function handleSelectBook(bookId: number) {
    setError(null)
    try {
  const selected = await getBook(bookId)
  setSelectedBook(selected)
    }
    catch {
      setError('Failed to load book')
    }
  }

/*
Code 3: Explanation
1. handleBookFormChange() runs when the book form changes.
2. next contains the the new book form values.
3. setBookForm(next) saves the new values to the book form state.
*/

  function handleBookFormChange(next: BookFormValues) {
    setBookForm(next)
  }

/*
Code 4 Explanation:
1. handleCheckoutFormChange() runs when the checkout form changes.
2. next contains the new checkout form values.
3. setCheckoutForm(next) saves the new values to the checkout form state.
*/

  function handleCheckoutFormChange(next: CheckoutFormValues) {
    setCheckoutForm(next)
  }

  /*
  Code 5 Explanation:
  1. handleCreateBook() runs when a new book is created.
  2. setError(null) clears old errors.
  3. The try block attempts to create the book.
  4. createBook(bookForm) sends the form data to the API.
  5. await waits for the new book to be created.
  6. createdBook stores the new book returned by the API.
  7. setBooks() adds the new book to the current book list.
  8. The catch block handles a failed request.
  9. setError() shows an error if the book cannot be created.
  */
 
  async function handleCreateBook() {
   setError(null)
   try {
const createdBook = await createBook(bookForm)
setBooks((current: Book[]) => [...current, createdBook])
   }
    catch {
  setError('Failed to create book')
}
   }

   /*
   Code 6 Explanation:
   1. handleCreateCheckout() runs when a checkout is created.
   2. setError(null) clears old errors.
   3. The try block attempts to create the checkout.
   4. createCheckout stores the new checkout.
   5. createdCheckout stores new checkout. 
   6. setBookCheckouts() adds it to the checkout list.
   7. The catch block handles errors.
   8. setError() shows an error if the checkout fails.
   */

  async function handleCreateCheckout() {
    setError(null)
    try {
      const createdCheckout = await createCheckout(checkoutForm)

      console.log("FORM BOOK:", checkoutForm.book_id)
      console.log("CREATED CHECKOUT:", createdCheckout)
      console.log("SELECTED BOOK:", selectedBook?.id)

      if (selectedBook?.id === createdCheckout.book_id) {
  setBookCheckouts((current: Checkout[]) => [...current, createdCheckout])
}
    }
    catch {
  setError('Failed to create checkout')
}
  }

  return (
    <main className="layout">
      <header>
        <h1>LibraryConnect Resource Hub</h1>
        <p>Starter frontend scaffold with TODOs for API integration.</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h2>Integration TODO</h2>
        <p>
          Route handlers, form wiring, and API calls are intentionally left as TODOs for the team.
        </p>
        <button onClick={() => void handleLoadBooks()}>Load Books (TODO API)</button>
      </section>

      <BookList
        books={books}
        search={search}
        genreFilter={genreFilter}
        onSearchChange={setSearch}
        onGenreChange={setGenreFilter}
        onSelectBook={(bookId) => void handleSelectBook(bookId)}
        genres={GENRES}
      />

      <BookForm
        values={bookForm}
        genres={GENRES}
        onChange={handleBookFormChange}
        onSubmit={() => void handleCreateBook()}
      />

      <BookDetail book={selectedBook} checkouts={bookCheckouts} />

      <CheckoutForm
        values={checkoutForm}
        books={books}
        onChange={handleCheckoutFormChange}
        onSubmit={() => void handleCreateCheckout()}
      />
    </main>
  )
}

export default App
