import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import AuthorTable from "./AuthorTable";

interface Props {}
interface Error {
    error: string;
}

const AddAuthorForm: React.FC<Props> = () => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [responseData, setResponseData] = useState<{ error?: string, message?: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/authors", {
                name,
                bio,
                });
                console.log(response.data);
                console.log(response.status);
                setResponseData(response.data);
                setName("");
                setBio("");
        } catch (error: any) {
            console.error(error);
            console.log(error.response?.status);
        }
    };

    return (
        <div className="">
            <form className="bg-white p-10 rounded-lg border border-black my-28 w-full" onSubmit={handleSubmit}>
                <h2 className="text-center text-lg font-bold mb-5">Add a new author</h2>
                <div className="mb-5">
                    <label htmlFor="name" className="text-lg font-medium mb-2">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="bio" className="text-lg font-medium mb-2">Bio:</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="w-full border border-gray-400 p-2"
                        />
                </div>
                
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                    Add Author
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

export default function AddAuthor() {
    return (
        <>
            <Header page={ "Add Author" }/>
            <div className="">
                <div className="w-1/4 float-left pl-10">
                    <AddAuthorForm />
                </div>
                <div className="w-3/4 float-right">
                    <AuthorTable />
                </div>
            </div>
            
        </>
    )
}