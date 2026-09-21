import type {
  Genre,
  Checkout,
  CheckoutFormValues,
  Book,
  BookFormValues,
} from "../types";

/*
Code 1 Explanation: 
1) If user searches "Harry Potter", my code will build: http://localhost:8000/books?q=Harry+Potter
2) Then it will send that request to my FastAPI backend: await fetch(url)
3) Then the backend will get the matching books from the database
4) Then my frontend will receive them: return response.json()
*/

const API_BASE_URL = "http://localhost:8000";

export async function listBooks(_params?: {
  q?: string;
  genre?: Genre | "All";
}): Promise<Book[]> {
  const params = new URLSearchParams();

if (_params?.q) {
  params.set("q", _params.q);
}

if (_params?.genre && _params.genre !== "All") {
  params.set("genre", _params.genre);
}

const query = params.toString();
const url = `${API_BASE_URL}/books${query ? `?${query}` : ""}`;

const response = await fetch(url);

if (!response.ok) {
  throw new Error("Failed to load books");
}

return response.json();
}

/* 
Code 2 Explanation:
1) When a user clicks a book, the function takes that book's ID and uses it to request the specific book 
from the backend. 
2) If the request works, the book's information is returned as JSON.
3) If the request fails, an error is returned.
*/

export async function getBook(_bookId: number): Promise<Book> {
const response = await fetch(`${API_BASE_URL}/books/${_bookId}`); /* (_bookId) Identifies which book, 
fetch(...) asks the backend for it. */

if (!response.ok) { /* Checks whether something went wrong */
  throw new Error("Failed to load book");
}

return response.json(); /* Gives the frontend the book data */
}

/* 
Code 3 Explanation: 
1) When a user fills out the Create Book Form, this function sends information to the backend using a POST request.
2) The form data is then converted into JSON before it is sent. 
3) If tne request is successful, the newly created book is returned as JSON.
4) If the request fails, an error is returned. */

export async function createBook(
  _payload: BookFormValues,
): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create book");
  }

  return response.json();

}



/*
Code 4 Explanation:
1) When a user selects a book, Its ID # will retrieve the number of times the book
has been checked out in records by requesting its checkout history from the backend.
2) If the request is unsuccessful, the checkout records are returned as JSON.
3) If the request fails, an error is returned.  */

export async function listBookCheckouts(
  _bookId: number,
): Promise<Checkout[]> {
 const response = await fetch( /* Fetch sends the retrieve request.  */
  `${API_BASE_URL}/books/${_bookId}/checkouts`
);

if (!response.ok) { /* Checks if the backend properly responsed. */
  throw new Error("Failed to load book checkouts");
}

return response.json(); /* Converts the response into data the frontend can use. */
}

/* 
Code 5 Explanation:
1) When a user checks out a book, this function sends the checkout information to the baackend using a POST
request.
2) The checkout data is then converted into JSON before it is sent.
3) If the request is successful, the newly created checkout is returned as JSON.
4) If the request fails, an error is returned. 
*/

export async function createCheckout(
  _payload: CheckoutFormValues,
): Promise<Checkout> {
  const response = await fetch(`${API_BASE_URL}/checkouts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(_payload),
});

if (!response.ok) {
  throw new Error("Failed to create checkout");
}

return response.json();
}
