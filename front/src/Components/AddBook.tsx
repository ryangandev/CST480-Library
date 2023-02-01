import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import AuthorTable from "./AuthorTable";

interface Props {}

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
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="">
            <form className="bg-white p-10 rounded-lg border border-black my-28 w-full" onSubmit={handleSubmit}>
                <h2 className="text-center text-lg font-bold mb-5">Add a new book</h2>
                <div className="mb-5">
                    <label htmlFor="authorId" className="text-lg font-medium mb-2">Author ID:</label>
                    <input
                        type="text"
                        id="authorId"
                        value={authorId}
                        onChange={(event) => setAuthorId(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
    
                <div className="mb-5">
                    <label htmlFor="title" className="text-lg font-medium mb-2">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
    
                <div className="mb-5">
                    <label htmlFor="pubYear" className="text-lg font-medium mb-2">Publication Year:</label>
                    <input
                        type="text"
                        id="pubYear"
                        value={pubYear}
                        onChange={(event) => setPubYear(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
    
                <div className="mb-5">
                    <label htmlFor="genre" className="text-lg font-medium mb-2">Genre:</label>
                    <input
                        type="text"
                        id="genre"
                        value={genre}
                        onChange={(event) => setGenre(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
    
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Add Book
                </button>
                <div className="mt-5">
                    {responseData?.error && (
                        <p className="text-red-500 font-bold">{responseData.error}</p>
                    )}
                    {responseData?.message && (
                        <p className="text-green-500 font-bold">{responseData.message}</p>
                    )}
                </div>
            </form>
            
        </div>
    );
};

export default function AddBook() {
    return (
        <>
            <Header page={ "Add Book" }/>
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