import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import BookTable from './BookTable';
import { FormGroup, FormControl, InputLabel, Input, Button } from "@mui/material";

const UpdateBookForm: React.FC = () => {
    const [bookId, setBookId] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [title, setTitle] = useState("");
    const [pubYear, setPubYear] = useState("");
    const [genre, setGenre] = useState("");
    const [responseData, setResponseData] = useState<{ error?: string, message?: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await axios.put(`/api/books/${bookId}`, {
                id: bookId,
                author_id: authorId,
                title,
                pub_year: pubYear,
                genre,
            });
            console.log(response.data);
            setResponseData(response.data);
            setBookId("");
            setAuthorId("");
            setTitle("");
            setPubYear("");
            setGenre("");
        } catch (error:any) {
            console.error(error);
            setErrorMessage(error.response.data.message);
            if (error.response?.status === 401) {
                setResponseData({ error: "Please log in before adding a book" });
            }
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <FormGroup className="bg-white p-10 rounded-lg border border-black my-28 w-full">
                    <h2 className="text-center text-lg font-bold mb-5">Update a book</h2>
                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="bookId">Book ID</InputLabel>
                        <Input 
                            id="bookId"
                            value={bookId}
                            onChange={(event) => setBookId(event.target.value)} />
                    </FormControl>

                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="authorId">Author ID</InputLabel>
                        <Input 
                            id="authorId"
                            value={authorId}
                            onChange={(event) => setAuthorId(event.target.value)} />
                    </FormControl>

                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input
                            id="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)} />
                    </FormControl>

                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="genre">Genre</InputLabel>
                        <Input
                            id="genre"
                            value={genre}
                            onChange={(event) => setGenre(event.target.value)} />
                    </FormControl>

                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="pubYear">Publication Year</InputLabel>
                        <Input
                            id="pubYear"
                            value={pubYear}
                            onChange={(event) => setPubYear(event.target.value)} />
                    </FormControl>

                    <Button 
                        className="mt-5"
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        sx={{ mt:2, width: 150}}>
                        Update Book
                    </Button>
                    
                    <div className="mt-5">
                        {responseData?.error && (
                            <p className="text-red-500 font-bold">{responseData.error}</p>
                        )}
                        {responseData?.message && (
                            <p className="text-green-500 font-bold">{responseData.message}</p>
                        )}
                    </div>
                </FormGroup>
            </form>
        </div>
    );
};

export default function Library() {
    return (
        <>
            <p className="text-2xl font-bold text-center pt-10">Welcome to Ryan's Library. Here are all books in our library.</p>
            <div id="message"></div>
            
            <div className="">
                <div className="w-1/4 float-left pl-10">
                    <UpdateBookForm />
                </div>
                <div className="w-3/4 float-right">
                    <BookTable />
                </div>
            </div>
        </>
        
        
    )
}