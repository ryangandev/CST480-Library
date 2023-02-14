import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="text-center py-16">
                <p className="block text-6xl my-16">Welcome to Ryan's Library!</p>
                <p className="block text-2xl my-10">Visit our <button className=" text-blue-500 underline underline-offset-auto" onClick={() => { navigate("/Library") }}>Library</button> to check out all of our current books!</p>
                <p className="block text-2xl my-10">Click <button className=" text-blue-500 underline underline-offset-auto" onClick={() => { navigate("/AddBook") }}>Add Book</button> to add your book to our catalog!</p>
                <p className="block text-2xl my-10">Click <button className=" text-blue-500 underline underline-offset-auto" onClick={() => { navigate("/AddAuthor") }}>Add Author</button> to add an author to our catalog!</p>
            </div>
        </>
        
    )
}