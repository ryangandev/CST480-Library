import express, {Express, Request, Response } from "express";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";

let app: Express = express();
app.use(express.static("public"));
app.use(express.json());

// create database "connection"
// use absolute path to avoid this issue
// https://github.com/TryGhost/node-sqlite3/issues/441
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

//
// SQLITE EXAMPLES
// comment these out or they'll keep inserting every time you run your server
// if you get 'UNIQUE constraint failed' errors it's because
// this will keep inserting a row with the same primary key
// but the primary key should be unique
//
/*
// insert example
await db.run(
    "INSERT INTO authors(id, name, bio) VALUES('1', 'Figginsworth III', 'A traveling gentleman.')"
);
await db.run(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES ('1', '1', 'My Fairest Lady', '1866', 'romance')"
);

// insert example with parameterized queries
// important to use parameterized queries to prevent SQL injection
// when inserting untrusted data
let statement = await db.prepare(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)"
);
await statement.bind(["2", "1", "A Travelogue of Tales", "1867", "adventure"]);
await statement.run();

// select examples
let authors = await db.all("SELECT * FROM authors");
console.log("Authors", authors);
let books = await db.all("SELECT * FROM books WHERE author_id = '1'");
console.log("Books", books);
let filteredBooks = await db.all("SELECT * FROM books WHERE pub_year = '1867'");

console.log("Some books", filteredBooks);*/

/*
//
// EXPRESS EXAMPLES
//

// GET/POST/DELETE example
interface Foo {
    message: string;
}
interface Error {
    error: string;
}
type FooResponse = Response<Foo | Error>;
// res's type limits what responses this request handler can send
// it must send either an object with a message or an error
app.get("/foo", (req, res: FooResponse) => {
    if (!req.query.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.query.bar} in the query` });
});
app.post("/foo", (req, res: FooResponse) => {
    if (!req.body.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.body.bar} in the body` });
});
app.delete("/foo", (req, res) => {
    // etc.
    res.sendStatus(200);
});*/

//
// ASYNC/AWAIT EXAMPLE
//

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/*
// need async keyword on request handler to use await inside it
app.get("/bar", async (req, res: FooResponse) => {
    console.log("Waiting...");
    // await is equivalent to calling sleep.then(() => { ... })
    // and putting all the code after this in that func body ^
    await sleep(3000);
    // if we omitted the await, all of this code would execute
    // immediately without waiting for the sleep to finish
    console.log("Done!");
    return res.sendStatus(200);
});
// test it out! while server is running:
// curl http://localhost:3000/bar*/

// Interface declaration for Book, Author and Error type
interface Book {
    id: number;
    author_id: string;
    title: string;
    pub_year: string;
    genre: string;
}

interface Author {
    id: number;
    name: string;
    bio: string;
}

interface Error {
    error: string;
}

// Declare types for books response and authors response
type BookResponse = Book[] | Error;
type AuthorResponse = Author[] | Error;

// GET all books
app.get("/api/books", async (req: Request, res: Response) => {
    let books: BookResponse = await db.all(`SELECT books.id, authors.name || ' (id: ' || authors.id || ')' AS author_name, books.title, books.pub_year, books.genre FROM books INNER JOIN authors ON books.author_id = authors.id ORDER BY books.title`);
    res.json({ books });
});

// GET all authors
app.get("/api/authors", async (req: Request, res: Response) => {
    let authors: AuthorResponse = await db.all(`SELECT * FROM authors ORDER BY name`);
    res.json({ authors });
});

// GET a book with its unique id
app.get("/api/books/:id", async (req: Request, res: Response) => {
    let book: Book | undefined = await db.get("SELECT * FROM books WHERE id = ?", req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
});

// GET a author with its unique id
app.get("/api/authors/:id", async (req: Request, res: Response) => {
    let author: Author | undefined  = await db.get("SELECT * FROM authors WHERE id = ?", req.params.id);
    if (!author) {
        return res.status(404).json({ error: "Author not found" });
    }
    res.json(author);
});

// GET request to retrieve all books from an author
app.get("/api/authors/:id/books", async (req: Request, res: Response) => {
    let books: BookResponse = await db.all("SELECT * FROM books WHERE author_id = ?", req.params.id);
    if (!books) {
        return res.status(404).json({ error: "Books not found for this author" });
    }
    res.json({ books });
});

// GET request to retrieve all books from a genre
app.get("/api/books/genre", async (req: Request, res: Response) => {
    // before change type for genre and params
    // const { genre } = req.query;
    // let query: string = "SELECT * FROM books";
    // let params = [];
    const genre = req.query.genre as string;
    let query: string = "SELECT * FROM books";
    let params: string[] = [];

    if (genre) {
        query += " WHERE genre = ?";
        params.push(genre);
    }

    try {
        let books: BookResponse = await db.all(query, params);
        res.json({ books });
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch books" });
    }
});

// GET request to retrieve all books of a certain publish year
app.get("/api/books/year", async (req: Request, res: Response) => {
    if (!req.query.pub_year) {
        return res.status(400).json({ error: "pub_year is required" });
    }
    let books: BookResponse;
    try {
        books = await db.all(`SELECT * FROM books WHERE pub_year = ?`, req.query.pub_year);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch books" });
    }
    if (!books) {
        return res.status(404).json({ error: "Books not found" });
    }
    res.json({ books });
});


// POST request to create a new book
app.post("/api/books", async (req: Request, res: Response) => {
    // check input is empty
    if (!req.body.author_id || !req.body.title || !req.body.pub_year || !req.body.genre) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // check if author exists
    let author: Author | undefined = await db.get("SELECT * FROM authors WHERE id = ?", req.body.author_id);
    if (!author) {
        return res.status(404).json({ error: "Author not found, create the author first" });
    }

    // insert new book into the books table
    try {
        let statement = await db.prepare(
            "INSERT INTO books(author_id, title, pub_year, genre) VALUES (?, ?, ?, ?)"
        );
        await statement.bind([req.body.author_id, req.body.title, req.body.pub_year, req.body.genre]);
        await statement.run();
    } catch (err) {
        return res.status(500).json({ error: "Failed to insert book" });
    }

    return res.status(201).json({ message: "Book created successfully!" });
});

// Post request to create a new author
app.post("/api/authors", async (req: Request, res: Response) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let statement = await db.prepare(
            "INSERT INTO AUTHORS(name, bio) VALUES (?, ?)"
        );
        await statement.bind([req.body.name, req.body.bio]);
        await statement.run();
    } catch (err) {
        return res.status(500).json({ error: "Failed to insert author" });
    }

    return res.status(201).json({ message: "Author created successfully!" });
})

// DELETE a book based on id
app.delete("/api/books/:id", async (req: Request, res: Response) => {
    // check if the book exists
    let book: Book | undefined = await db.get("SELECT * FROM books WHERE id = ?", req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    try {
        let result = await db.run("DELETE FROM books WHERE id = ?", req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete book" });
    }
});

// Delete an author based on id, ask to delete all their books first
app.delete("/api/authors/:id", async (req: Request, res: Response) => {
    // check if the author exists
    let author: Author | undefined = await db.get("SELECT * FROM authors WHERE id = ?", req.params.id);
    if(!author) {
        return res.status(404).json({ error: "Author not found"});
    }

    try {
        // check if there are books written by this author
        let books: BookResponse = await db.all("SELECT * FROM books WHERE author_id = ?", req.params.id);
        if (Array.isArray(books) && books.length > 0) {
            return res.status(400).json({ error: "Please delete the books written by this author first before deleting the author." });
        }

        // delete the author
        await db.run("DELETE FROM authors WHERE id = ?", req.params.id);
        return res.status(200).json({ message: "Author deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to delete author" });
    }
})

// Uncommon this for deployment
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./out/public", "index.html"));
});

// run server
let port: number = 3000;
let host = "localhost";
let protocol = "http";
app.get("/api", (req: Request, res: Response): void => {
    res.send("You have reached the API!");
})

app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
