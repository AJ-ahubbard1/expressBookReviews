const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
