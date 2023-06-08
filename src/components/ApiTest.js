import firebase from "../firebase";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

import { useEffect, useState } from "react";

const ApiTest = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      // here we're creating a variable to store the new state we want to introduce to our app
      const newState = [];

      // here we store the response from our query to Firebase inside of a variable called data.
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();
      // data is an object, so we iterate through it using a for in loop to access each book name

      for (let key in data) {
        // inside the loop, we push each book name to an array we already created inside the onValue() function called newState
        newState.push(data[key]);
      }

      // then, we call setBooks in order to update our component's state using the local array newState
      setBooks(newState);

      for (let key in data) {
        // pushing the values from the object into our newState array
        newState.push({ key: key, name: data[key] });
      }

      console.log(newState);
      console.log(books);
    });
  }, []);

  const [userInput, setUserInput] = useState("");

  // this event will fire every time there is a change in the input it is attached to
  const handleInputChange = (event) => {
    // we're telling React to update the state of our `App` component to be
    // equal to whatever is currently the value of the input field
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    // event.preventDefault prevents the default action (form submission and page refresh)
    event.preventDefault();

    // create a reference to our database
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    // push the value of the `userInput` state to the database
    push(dbRef, userInput);

    // reset the state to an empty string
    setUserInput("");
  };

  // this function takes an argument, which is the ID of the book we want to remove
  const handleRemoveBook = (bookId) => {
    // here we create a reference to the database
    // this time though, instead of pointing at the whole database, we make our dbRef point to the specific node of the book we want to remove
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${bookId}`);

    // using the Firebase method remove(), we remove the node specific to the book ID
    remove(dbRef);
  };
  return (
    <div>
      <h1>api test</h1>
      <ul>
        {books.map((book) => {
          return (
            <li key={book.key}>
              <p>
                {book.name}
                <button onClick={() => handleRemoveBook(book.key)}>
                  Remove
                </button>
              </p>
            </li>
          );
        })}
      </ul>

      <form action="submit">
        <label htmlFor="newBook">Add a book to your bookshelf</label>
        <input
          type="text"
          id="newBook"
          onChange={handleInputChange}
          value={userInput}
        />
        <button onClick={handleSubmit}>Add Book</button>
      </form>
    </div>
  );
};

export default ApiTest;
