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
    user_id: string;
    name: string;
    bio: string;
}

interface User {
    id: number;
    username: string;
    role: string;
}

interface Error {
    error: string;
}

interface MessageResponse {
    message: string;
}

// Declare types for books response and authors response
type BookResponse = Book[] | Error;
type AuthorResponse = Author[] | Error;
type UserData = User[] | Error;
type EmptyResponse = "";

export { Book, Author, Error, BookResponse, AuthorResponse, MessageResponse, EmptyResponse, User, UserData };