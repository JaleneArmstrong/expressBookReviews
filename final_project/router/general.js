const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const requestedAuthor = req.params.author;
    const matchingBooks = [];

    Object.keys(books).forEach((key) => {
      const book = books[key];
      if (book.author.toLowerCase() === requestedAuthor.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...book });
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title.trim().toLowerCase();
    const matchingBooks = [];

  for (const key in books) {
    const bookTitle = books[key].title.trim().toLowerCase();
    if (bookTitle === requestedTitle) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with the given title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      const reviews = books[isbn].reviews;
      res.status(200).send(JSON.stringify({ reviews: reviews }, null, 4));
    } else {
      res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 4));
    }
  
});

module.exports.general = public_users;
