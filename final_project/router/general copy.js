const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users").isValid;
let users = require("./auth_users").users;
const public_users = express.Router();


const axios = require('axios');

public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "Books not found" });
        }
    })
    .then((books) => res.json(books))
    .catch((err) => res.status(500).json(err));
});




public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: "Book not found" });
        }
    })
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json(err));
});


  
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject({ message: "No books found for this author" });
        }
    })
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json(err));
});

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter(book => book.title === title);
        
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject({ message: "No books found for this title" });
        }
    })
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        res.json(books[isbn].reviews); // Return the reviews
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

let genUsers = []

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = genUsers.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = genUsers.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});
 


module.exports.general = public_users;
