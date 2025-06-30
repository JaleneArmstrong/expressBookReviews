const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function promiseCb(callback, delay) {
    return new Promise((resolve) => {
        setTimeout(() => callback(resolve), delay);
    });
}

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
public_users.get('/', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const booksList = Object.values(books);
            resolve(booksList);
        }, 3000);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "An Internal Server Error Occurred."});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const isbn = req.params.isbn + "";
            const book = books[isbn];
            resolve(book);
        }, 3000);
        
        if (data) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid ISBN Provided" });
    } catch (error) {
        return res.status(500).json({ message: "An Internal Server Error Occurred." });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const author = (req.params.author + "").toLocaleLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) => 
                book.author.toLocaleLowerCase().match(author)    
            );
            resolve(newBooks);
        }, 3000);

        if (Array.isArray(data) && data.length) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid Author Provided "});
    } catch (error) {
        return res.status(500).json({ message: "An Internal Server Error Occurred." });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const title = (req.params.title + "").toLocaleLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) =>
                book.title.toLocaleLowerCase().match(title)
            );
            resolve(newBooks);
        }, 3000);

        if (Array.isArray(data) && data.length) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid Title Provided"});
    } catch (error) {
        return res.status(500).json({ message: "An Internal Server Error Occurred." });
    }
});

// Get book review
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
