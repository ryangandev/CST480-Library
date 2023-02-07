import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridValueGetterParams, GridApi } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

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
            const response = await axios.get('/api/books');
            const books = await response.data;
            setBooks(books.books);
        };

        const fetchAuthors = async () => {
            const response = await axios.get('/api/authors');
            const authors = await response.data;
            setAuthors(authors.authors);
        };

        fetchBooks();
        fetchAuthors();
    }, []);

    const handleAuthorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleBookDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const bookId = event.currentTarget.value;
        if (window.confirm(`Are you sure you want to delete the book with id: ${bookId}?`)) {
            try {
                const response = await axios.delete(`/api/books/${bookId}`);
                console.log(response.data);
                // Re-render the table here
                const fetchBooks = async () => {
                    const response = await axios.get('/api/books');
                    const books = await response.data;
                    setBooks(books.books);
                };
                fetchBooks();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Book No.', width: 120, headerAlign: "center" },
        { field: 'title', headerName: 'Book Title', width: 250, headerAlign: "center", editable: true },
        { field: 'author_name', headerName: 'Author No.', width: 200, headerAlign: "center" },
        { field: 'genre', headerName: 'Genre', width: 200, headerAlign: "center"},
        { field: 'pub_year', headerName: 'Publication Year', type: 'number', width: 200, headerAlign: "center" },
        { field: 
            'action', 
            headerName: '', 
            width: 120, 
            sortable: false,
            renderCell: (params) => {
                console.log(params.id);
                return <>
                    <button 
                        value={params.id} 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                        onClick={handleBookDelete}><DeleteIcon /></button>
                    </>;
                    }
                }];

      

    const rows = Array.isArray(books) ? books.map((row) => ({
        id: row.id, 
        title: row.title,
        author_name: row.author_name,
        genre: row.genre,
        pub_year: row.pub_year,
    })) : [];

    return (
        <div className="w-3/5 mx-auto my-10">
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default BookTable;
