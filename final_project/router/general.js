const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
axios.get('http://localhost:5000/')
  .then(response => {
    console.log("Books list:", response.data);
  })
  .catch(error => {
    console.error("Error fetching books:", error.message);
  });
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(response => {
    console.log("Book details:", response.data);
  })
  .catch(error => {
    console.error("Error fetching book by ISBN:", error.message);
  });// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const requestedAuthor = req.params.author;
axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
  .then(response => {
    console.log("Books by author:", response.data);
  })
  .catch(error => {
    console.error("Error fetching books by author:", error.message);
  });
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title.trim().toLowerCase();
axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
  .then(response => {
    console.log("Books with title:", response.data);
  })
  .catch(error => {
    console.error("Error fetching books by title:", error.message);
  }); Get book review
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
