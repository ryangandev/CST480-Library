import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
    id: number;
    author_name: string;
    title: string;
    pub_year: string;
    genre: string;
}

interface Author {
    id: number;
    name: string;
  }
  
interface Error {
    error: string;
}

type BookResponse = Book[] | Error;
type AuthorResponse = Author[] | Error;

const BookTable: React.FC = () => {
    const [books, setBooks] = useState<BookResponse>([]);
    const [authors, setAuthors] = useState<AuthorResponse>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch('/api/books');
            const books = await response.json();
            setBooks(books.books);
        };

        const fetchAuthors = async () => {
            const response = await fetch('/api/authors');
            const authors = await response.json();
            setAuthors(authors.authors);
        };

        fetchBooks();
        fetchAuthors();
    }, []);

    const handleAuthorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="w-3/4 mx-auto my-10">
            <div className="my-5">
                <p>Search by:
                <span className="mx-3">
                    <select className='border rounded-md border-black'>
                        <option value="id">Book No.</option>
                        <option value="title">Title</option>
                        <option value="author_id">Author No.</option>
                        <option value="genre">Genre</option>
                        <option value="pub_year">Publication Year</option>
                    </select>
                </span>
                </p>
            </div>
            <table className="border w-full text-center">
                <thead>
                <tr className="bg-gray-300">
                    <th className="border px-4 py-2">No.</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Author</th>
                    <th className="border px-4 py-2">Genre</th>
                    <th className="border px-4 py-2">Publication Year</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(books) && books.map((book: Book) => (
                    <tr key={book.id}>
                    <td className="border px-4 py-2">{book.id}</td>
                    <td className="border px-4 py-2">{book.title}</td>
                    <td className="border px-4 py-2">{book.author_name}</td>
                    <td className="border px-4 py-2">{book.genre}</td>
                    <td className="border px-4 py-2">{book.pub_year}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
