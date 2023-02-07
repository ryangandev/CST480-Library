import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import AuthorTable from "./AuthorTable";
import { FormGroup, FormControl, InputLabel, Input, Button } from "@mui/material";

interface Props {}
interface Error {
    error: string;
}   
interface Author {
    id: number;
    name: string;
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
            <form onSubmit={handleSubmit}>
                <FormGroup className="bg-white p-10 rounded-lg border border-black my-28 w-full">
                    
                    <h2 className="text-center text-lg font-bold mb-5">Add a new author</h2>
                    <FormControl className="mb-10">
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(event) => setName(event.target.value)} />
                    </FormControl>

                    <FormControl className="mb-10">
                        <InputLabel htmlFor="bio">Bio</InputLabel>
                        <Input 
                            multiline={true} 
                            id="bio" 
                            value={bio}
                            onChange={(event) => setBio(event.target.value)} />
                    </FormControl>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary">
                        Add Author
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