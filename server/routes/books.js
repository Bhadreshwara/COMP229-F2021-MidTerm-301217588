// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// define the book model
let book = require("../models/books");

/* GET books List page. READ */
router.get("/", (req, res, next) => {
  // find all books in the books collection
  book.find((err, books) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("books/index", {
        title: "Books",
        books: books,
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get("/add", (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  res.render("books/details", {
    title: "Add a New Book", // Title of the page
    books: "", // The book object
    action: "/books/add", // The action attribute for the form
    buttonText: "Add Book", // The text of the submit button
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post("/add", (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  // create a new Book object with the data available to us from the request body
  let newBook = new book({
    Title: req.body.title,
    Description: req.body.description,
    Price: parseInt(req.body.price),
    Author: req.body.author,
    Genre: req.body.genre,
  });
  //create a book with database
  book.create(newBook, (err, books) => {
    if (err) {
      console.log(err);
    } else {
      // if everything went well, redirect to the books list page
      res.redirect("/books");
    }
  });

  // GET the Book Details page in order to edit an existing Book
  router.get("/:id", (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
    // find the book by its ID
    book.findById(req.params.id, (err, books) => {
      if (err) {
        return console.error(err);
      } else {
        res.render("books/details", {
          title: "Book Details",
          books: books,
          action: "/books/details" + books._id,
          buttonText: "Save Changes",
        });
      }
    });
  });

  // POST - process the information passed from the details form and update the document
  router.post("/:id", (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
    // Gets data from the form
    let updatedBook = {
      Title: req.body.title,
      Description: req.body.description,
      Price: parseInt(req.body.price),
      Author: req.body.author,
      Genre: req.body.genre,
    };

    book.update({ _id: req.params.id }, updatedBook, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/books");
      }
    });
  });
});

// GET - process the delete by user id
router.get("/delete/:id", (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  book.remove({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/books");
    }
  });
});

module.exports = router;
