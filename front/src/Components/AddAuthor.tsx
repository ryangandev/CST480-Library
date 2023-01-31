import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

interface Props {}

const AddAuthorForm: React.FC<Props> = () => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/authors", {
                name,
                bio,
                });
                console.log(response.data);
                setName("");
                setBio("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center bg-black">
            <form className="bg-white p-10 rounded-lg " onSubmit={handleSubmit}>
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
                    Submit
                </button>
            </form>
        </div>
    );
};

export default function AddAuthor() {
    return (
        <>
            <Header page={ "Add Author" }/>
            <AddAuthorForm />
        </>
    )
}