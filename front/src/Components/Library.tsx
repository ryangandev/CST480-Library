import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "./Header";
import BookTable from './BookTable';

export default function Library() {
    const navigate = useNavigate();
    
    return (
        <>
            <Header page={ "Library" }/>
            <p className="text-2xl font-bold text-center pt-10">Welcome to Ryan's Library. Here are all books in our library.</p>
            <p className="text-xl font-semibold text-center pt-5">Search for books by 
            <span>
                <select>
                    <option>Scific</option>
                    <option>Action</option>
                </select>
            </span>:</p>
            <div id="message"></div>

            <BookTable />



            {/* <p><a onClick={() => { navigate("/AddBook") }}>Add your book to our catalog</a></p>
            <p><a onClick={() => { navigate("/AddBook") }}>Add your an author to our catalog</a></p>
            <p><a onClick={() => { navigate("/AddBook") }}>Add your book to our catalog</a></p> */}
        </>
        
        
    )
}