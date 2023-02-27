CREATE TABLE books (
    id INTEGER PRIMARY KEY, -- can change to be integer if you want
    author_id TEXT,
    title TEXT,
    pub_year TEXT,
    genre TEXT,
    FOREIGN KEY(author_id) REFERENCES authors(id)
);

CREATE TABLE authors (
    id INTEGER PRIMARY KEY, -- can change to be integer if you want
    user_id TEXT,
    name TEXT,
    bio TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    role TEXT
);
