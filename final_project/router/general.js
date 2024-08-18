const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password })
      return res.status(200).json({ message: "User successfully registered. Now you can login" })
    } else {
      return res.status(409).json({ error: "User already exists!" })
    }
  }
  // Return error if username or password is missing
  return res.status(400).json({ error: "Cannot register, missing username and/or password" })
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book) {
    return res.status(404).send({ error: "No book found" })
  }
  res.status(200).send(JSON.stringify(book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  //setting author strings to lowercase to ignore capitals when searching for a match
  const searchedAuthor = req.params.author.toLowerCase()
  // creates an array of isbns 
  const bookIsbns = Object.getOwnPropertyNames(books)

  let booksByAuthor = []
  bookIsbns.forEach(isbn => {
    let author = books[isbn].author.toLowerCase()
    if (author.match(searchedAuthor)) {
        booksByAuthor.push(books[isbn])
    }
  })

  res.status(200).send(JSON.stringify(booksByAuthor, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  //setting title strings to lowercase to ignore capitals when searching for a match
  const searchedTitle = req.params.title.toLowerCase()
  // creates an array of isbns 
  const bookIsbns = Object.getOwnPropertyNames(books)

  let booksByTitle = []
  bookIsbns.forEach(isbn => {
    let title = books[isbn].title.toLowerCase()
    if (title.match(searchedTitle)) {
        booksByTitle.push(books[isbn])
    }
  })
  res.status(200).send(JSON.stringify(booksByTitle, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book) {
    return res.status(404).send({ error: "No book found" })
  }
  res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
