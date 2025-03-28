import express from "express";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/isbn/";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "databaseDBaccess",
  port: 5432,
});

db.connect();

//TODO: ERROR CHECKING ON DB INSERT (/update)
//TODO: add new book to DB via edit

let data = [];
let edit = [];


//select all reviews from database then create a json
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    data = result.rows;
  } catch (error) {
    console.log("database " + error);
  };

  let ord = 1;
  if (req.query.o){
    ord = req.query.o;
  };

  res.render("index.ejs", {
    reviews: data,
    order: ord
  });

});


//select particular book review from database and edit
app.post("/edit", async (req, res) => {

  let id = req.body["book"];

  console.log("getting info for book: " + id);
  try {
    const result = await db.query("SELECT * FROM books WHERE book_id = $1", [id]);
    edit = result.rows;
    console.log(JSON.stringify(edit));

  } catch (error) {
    console.log("database " + error);
    res.redirect("/");
  };

  let book = edit[0];

  res.render("edit.ejs", {
    review: book
  });

});


//update database - edit existing book information
app.post("/update", async (req, res) => {

  let id = req.body["id"];
  let title = req.body["title"];
  let author = req.body["author"];
  let isbn = req.body["isbn"];
  let score = req.body["score"];
  let review = req.body["review"];
  let date = req.body["date"];
  let cover = API_URL + isbn + "-M.jpg";

  try {
    const result = await db.query("UPDATE books SET title = $2, author = $3, isbn = $4, score = $5, review = $6, date_read = $7, cover = $8 WHERE book_id = $1", [id, title, author, isbn, score, review, date, cover]);
  } catch (error) {
    console.log("database " + error);
  };

  res.redirect("/");

});


//redirect to new book page with blank fields
app.get("/new", async (req, res) => {

  res.render("new.ejs", {
  });

});


//update database - new book
app.post("/create", async (req, res) => {

  let title = req.body["title"];
  let author = req.body["author"];
  let isbn = req.body["isbn"];
  let score = req.body["score"];
  let review = req.body["review"];
  let date = req.body["date"];
  let cover = API_URL + isbn + "-M.jpg";

  try {
    const result = await db.query("INSERT INTO books (title, author, isbn , score, review, date_read, cover) VALUES ($1, $2, $3, $4, $5, $6, $7)", [title, author, isbn, score, review, date, cover]);
  } catch (error) {
    console.log("database " + error);
  };

  res.redirect("/");

});


//udpate database - delete book entry
app.post("/delete", async (req, res) => {

  let id = req.body["id"];

  try {
    const result = await db.query("DELETE FROM books WHERE book_id = $1", [id]);
  } catch (error) {
    console.log("database " + error);
  };

  res.redirect("/");

});