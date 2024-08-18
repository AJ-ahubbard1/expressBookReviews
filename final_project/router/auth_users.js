const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// users "database"
let users = [];

// check to see if the username already is registered in db
const isValid = (username) => { 
  let usersWithSameName = users.filter((user) => {
    return user.username === username
  })
  return usersWithSameName.length > 0
}

const authenticatedUser = (username,password)=> { 
    let match = false
    users.forEach((user) => {
        if (user.username === username && user.password === password) {
            match = true;
        }
    })
    return match
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ error: "Cannot login, missing username and/or password" })
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      { data: password }, 
      "access",
      { expiresIn: 60*15}
    )

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send("User successfully logged in")
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" })
  }
});

// Add a book review
// reviews : { "user123": "5/5 - I couldn't stop reading!"}
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const book = books[isbn]
  
  if (!book) {
    return res.status(404).send({ error: "No book found" })
  }
  
  const review = req.query.review
  const username = req.session.authorization.username 
  book.reviews[username] = review
  
  res.status(200).send(JSON.stringify(book, null, 4));
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
