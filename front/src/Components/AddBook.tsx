import React, { useState } from "react";
import axios from "axios";
import AuthorTable from "./AuthorTable";
import { FormGroup, FormControl, InputLabel, Input, Button } from "@mui/material";
import '../styles/AddBookForm.css';

interface Props {}

interface Book {
    id: number;
    author_name: string;
    title: string;
    pub_year: string;
    genre: string;
}

const AddBookForm: React.FC<Props> = () => {
    const [authorId, setAuthorId] = useState("");
    const [title, setTitle] = useState("");
    const [pubYear, setPubYear] = useState("");
    const [genre, setGenre] = useState("");
    const [responseData, setResponseData] = useState<{ error?: string, message?: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await axios.post("/api/books", {
                author_id: authorId,
                title,
                pub_year: pubYear,
                genre,
            });
            console.log(response.data);
            setResponseData(response.data);
            setAuthorId("");
            setTitle("");
            setPubYear("");
            setGenre("");
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                setResponseData({ error: "Please log in before adding a book" });
            }
        }
    };
    
    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <FormGroup className="bg-white p-10 rounded-lg border border-black my-28 w-full">
                    <h2 className="text-center text-lg font-bold mb-5">Add a new book</h2>
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
                        Add Book
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

export default function AddBook() {
    return (
        <>
            <div className="">
                <div className="w-1/4 float-left pl-10">
                    <AddBookForm />
                </div>
                <div className="w-3/4 float-right">
                    <AuthorTable />
                </div>
            </div>
        </>
        
    )
}