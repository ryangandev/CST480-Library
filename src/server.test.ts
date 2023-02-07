import axios, { AxiosError } from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import { response } from "express";
import { title } from "process";
import { isStringObject } from "util/types";

let port = 3000;
let host = "localhost";
let protocol = "http";
let baseUrl = `${protocol}://${host}:${port}`;

// create database "connection"
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

/*
test("GET /foo?bar returns message", async () => {
    let bar = "xyzzy";
    let { data } = await axios.get(`${baseUrl}/foo?bar=${bar}`);
    expect(data).toEqual({ message: `You sent: ${bar} in the query` });
});

test("GET /foo returns error", async () => {
    try {
        await axios.get(`${baseUrl}/foo`);
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        // now, after the if-statement, typescript knows
        // that errorObj can't be undefined
        let { response } = errorObj;
        // TODO this test will fail, replace 300 with 400
        expect(response.status).toEqual(300);
        expect(response.data).toEqual({ error: "bar is required" });
    }
});

test("POST /bar works good", async () => {
    let bar = "xyzzy";
    let result = await axios.post(`${baseUrl}/foo`, { bar });
    expect(result.data).toEqual({ message: `You sent: ${bar} in the body` });
});*/

// Teardown function thtat executes after every test
afterEach(async () => {   
    // clear all rows from books and authors table
    await db.run("DELETE FROM books");  
    await db.run("DELETE FROM authors");
});

/**
 * Tests for route "GET /api/books" -- returns all books
 */
test("GET /api/books returns status 200", async () => {
    let { status } = await axios.get(`${baseUrl}/api/books`);
    expect(status).toEqual(200);
})

test("GET /api/books returns an array", async () => {
    let { data } = await axios.get(`${baseUrl}/api/books`);
    expect(Array.isArray(data.books)).toBe(true);
})

test("GET /api/books return response data contains books", async () => {
    let response = await axios.get(`${baseUrl}/api/books`);
    expect(response.data).toHaveProperty("books");
})

test("GET /api/books returns expected number of books", async () => {
    // Manully inserting an author and two books
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement2.bind(["1", "A Travelogue of Tales", "1867", "adventure"]);
    await statement2.run();

    let statement3 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement3.bind(["1", "Smile", "1897", "adventure"]);
    await statement3.run();

    let { data } = await axios.get(`${baseUrl}/api/books`);
    let expectedNumberOfBooks = 2; // assuming there are 2 books in the database
    expect(data.books.length).toBe(expectedNumberOfBooks);
})

test("GET /api/books returns books with correct attributes", async () => {
    // Manully inserting an author and a book
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement2.bind(["1", "A Travelogue of Tales", "1867", "adventure"]);
    await statement2.run();

    let { data } = await axios.get(`${baseUrl}/api/books`);
    let expectedNumberOfBooks = 1;
    expect(data.books.length).toBe(expectedNumberOfBooks);
    for (let book of data.books) {
        expect(book).toHaveProperty("author_name");
        expect(book).toHaveProperty("title");
        expect(book).toHaveProperty("pub_year");
        expect(book).toHaveProperty("genre");
    }
})

/**
 * Tests for route "GET /api/authors" -- returns all authors
 */
test("GET /api/authors returns status 200", async () => {
    let { status } = await axios.get(`${baseUrl}/api/authors`);
    expect(status).toEqual(200);
})

test("GET /api/authors returns an array", async () => {
    let { data } = await axios.get(`${baseUrl}/api/authors`);
    expect(Array.isArray(data.authors)).toBe(true);
})

test("GET /api/authors return response data contains authors", async () => {
    let response = await axios.get(`${baseUrl}/api/authors`);
    expect(response.data).toHaveProperty("authors");
})

test("GET /api/authors returns expected number of authors", async () => {
    // Manully inserting two authors
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();
    
    let statement2 = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement2.bind(["Chris", "1925"]);
    await statement2.run();
    
    let { data } = await axios.get(`${baseUrl}/api/authors`);
    let expectedNumberOfAuthors = 2;
    expect(data.authors.length).toBe(expectedNumberOfAuthors);
})

test("GET /api/authors returns authors with correct attributes", async () => {
    // Manully inserting an author
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let { data } = await axios.get(`${baseUrl}/api/authors`);
    let expectedNumberOfAuthors = 1;
    expect(data.authors.length).toBe(expectedNumberOfAuthors);
    for (let author of data.authors) {
        expect(author).toHaveProperty("name");
        expect(author).toHaveProperty("bio");
    }
})

/**
 * Tests for route "GET /api/books/:id" -- returns the book with a correct id
 */
test("GET /api/books/:id returns the book with a correct id", async () => {
    // Manully inserting an author with id 1 and a book
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement2.bind(["1", "A Travelogue of Tales", "1867", "adventure"]);
    await statement2.run();

    let { data } = await axios.get(`${baseUrl}/api/books/1`);
    expect(data).toHaveProperty("id", 1);
});

test("GET /api/books/:id returns a 404 error if book is not found", async () => {
    try {
        // book with id 99 does not exist, should return an error
        await axios.get(`${baseUrl}/api/books/99`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(404);
        expect(response.data).toEqual({ error: "Book not found" });
    }
});

test("GET /api/books/:id returns expected properties of the book", async () => {
    // Manully inserting an author and a book with id 1
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement2.bind(["1", "A Travelogue of Tales", "1867", "adventure"]);
    await statement2.run();

    let { data } = await axios.get(`${baseUrl}/api/books/1`);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("author_id");
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("pub_year");
    expect(data).toHaveProperty("genre");
});

/**
 * Tests for route "GET /api/authors/:id" -- returns the author with a correct id
 */
test("GET /api/authors/:id returns a author with the correct id", async () => {
    // Manully inserting two authors with id 1 and 2 (auto increment)
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Chris", "1999"]);
    await statement.run();

    // The second author should have an id of 2
    let { data } = await axios.get(`${baseUrl}/api/authors/2`);
    expect(data).toHaveProperty("id", 2);
});

test("GET /api/authors/:id returns 404 error if author is not found", async () => {
    try {
        // author with id 99 does not exist, should return an error
        await axios.get(`${baseUrl}/api/authors/99`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }

        let { response } = errorObj;
        expect(response.status).toEqual(404);
        expect(response.data).toEqual({ error: "Author not found" });
    }
});

test("GET /api/authors/:id returns author data", async () => {
    // Manually inserting an author with id 1
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let { data } = await axios.get(`${baseUrl}/api/authors/1`);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("bio");
});

/**
 * Tests for route "GET /api/authors/:id/books" -- returns all books given an author id
 */
test("GET /api/authors/:id/books returns all books from an author", async () => {
    // Manually inserting an author with id 1 and two books written by the same author
    let statement = await db.prepare(
        "INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1867"]);
    await statement.run();

    let statement2 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement2.bind(["1", "A Travelogue of Tales", "1867", "adventure"]);
    await statement2.run();

    let statement3 = await db.prepare(
        "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement3.bind(["1", "John", "2000", "adventure"]);
    await statement3.run();

    let response = await axios.get(`${baseUrl}/api/authors/1/books`);
    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty("books");
    expect(Array.isArray(response.data.books)).toBe(true);
    for (let book of response.data.books) {
        expect(book).toHaveProperty("author_id", "1");
    }
});
    
test("GET /api/authors/:id/books returns 404 error if books are not found for author", async () => {
    try {
        await axios.get(`${baseUrl}/api/authors/5/books`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(404);
        expect(response.data).toEqual({ error: "Books not found for this author" });
    }
});

test("GET /api/authors/:id/books returns error if request fails", async () => {
    try {
        await axios.get(`${baseUrl}/api/authors/1/books`);
    } catch (error) {
        let errorObj = error as AxiosError;
        expect(errorObj.message).toEqual("Network Error");
    }
})

/**
 * Tests for route "POST /api/books" -- adding a book to the books table
 */
test("POST /api/books creates a new book", async () => {

    // Inserting a new author into the authors table
    let statement = await db.prepare("INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1975"]);
    await statement.run();
    
    // Getting the author_id of the inserted author
    let author = await db.get("SELECT * FROM authors WHERE name = ?", "Ryan");
    let author_id: number  = author.id;
    console.log(isStringObject(author_id));

    // Sending a POST request with the required fields to create a new book
    let book = { author_id: Number(author_id), title: "Halo", pub_year: "2020", genre: "Fiction" };
    let result = await axios.post(`${baseUrl}/api/books`, book);
    expect(result.status).toEqual(201);
    expect(result.data).toEqual({ message: "Book created successfully!" });

    // Checking that the new book was inserted into the books table
    //let books = await db.all("SELECT * FROM books WHERE title = ?", "Halo");
    let books = await db.all("SELECT * FROM books ");
    expect(books.length).toBe(1);
    expect(books[0]).toHaveProperty("author_id");
    expect(books[0]).toHaveProperty("title", books[0].title);
    expect(books[0]).toHaveProperty("pub_year", books[0].pub_year);
    expect(books[0]).toHaveProperty("genre", books[0].genre);

});

test("POST /api/books fails with missing required fields", async () => {
    let book = {
        title: "The Great Gatsby",
        pub_year: "1925",
        genre: "Fiction"
    };
  
    try {
        let result = await axios.post(`${baseUrl}/api/books`, book);
        } catch (error: any) {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual({ error: "Missing required fields" });
    }
});

test("POST /api/books fails with author not found", async () => {
    let book = {
      author_id: "456",
      title: "The Great Gatsby",
      pub_year: "1925",
      genre: "Fiction"
    };
  
    try {
      let result = await axios.post(`${baseUrl}/api/books`, book);
    } catch (error: any) {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual({ error: "Author not found, create the author first" });
    }
});


/**
 * Tests for route "PUT /api/books/:id" -- update a book in the books table
 */
test("PUT /api/books/:id updates a book", async () => {
    // Inserting a new author into the authors table
    let statement = await db.prepare("INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1975"]);
    await statement.run();
    
    // Getting the author_id of the inserted author
    let author = await db.get("SELECT * FROM authors WHERE name = ?", "Ryan");
    let author_id = author.id;
    
    // Inserting a new book into the books table
    statement = await db.prepare("INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)");
    await statement.bind([author_id, "Halo", "2020", "Fiction"]);
    await statement.run();
    
    // Getting the id of the inserted book
    let book = await db.get("SELECT * FROM books WHERE title = ?", "Halo");
    let book_id = book.id;
    
    // Sending a PUT request with the required fields to update the book
    let updatedBook = { id: 1, author_id: author_id, title: "Halo II", pub_year: "2021", genre: "Science Fiction" };
    let result = await axios.put(`${baseUrl}/api/books/${book_id}`, updatedBook);
    expect(result.status).toEqual(200);
    expect(result.data).toEqual({ message: "Book updated successfully!" });
    
    // Checking that the book was updated in the books table
    book = await db.get("SELECT * FROM books WHERE id = ?", book_id);
    expect(book).toHaveProperty("author_id");
    expect(book).toHaveProperty("title", "Halo II");
    expect(book).toHaveProperty("pub_year", "2021");
    expect(book).toHaveProperty("genre", "Science Fiction");
});

test("PUT /api/books/:id fails with book id not found", async () => {
    // Inserting a new author into the authors table
    let statement = await db.prepare("INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1975"]);
    await statement.run();
    // Sending a PUT request to update a book with an id that doesn't exist
    let book = { id: 20, author_id: 1, title: "Halo", pub_year: "2020", genre: "Fiction" };
    let result = await axios.put(`${baseUrl}/api/books/9999`, book).catch((err) => err.response);

    expect(result.status).toEqual(404);
    expect(result.data).toEqual({ error: "Book not found" });
});

test("PUT /api/books/:id fails with missing attributes", async () => {
    // Inserting a new author into the authors table
    let statement = await db.prepare("INSERT INTO authors(name, bio) VALUES (?, ?)");
    await statement.bind(["Ryan", "1975"]);
    await statement.run();
    // Inserting a new book into the books table
    let book = { author_id: 1, title: "Halo", pub_year: "2020", genre: "Fiction" };
    let result = await axios.post(`${baseUrl}/api/books`, book);
    expect(result.status).toEqual(201);
    expect(result.data).toEqual({ message: "Book created successfully!" });

    // Getting the id of the inserted book
    let books = await db.all("SELECT * FROM books WHERE title = ?", "Halo");
    let book_id: number = books[0].id;

    // Sending a PUT request to update a book with missing required fields
    let updatedBook = { author_id: 1 };
    let response = await axios.put(`${baseUrl}/api/books/${book_id}`, updatedBook).catch((err) => err.response);
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "Missing required fields" });
});