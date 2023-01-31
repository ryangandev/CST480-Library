import React from "react";
import LibraryIcon from "../Images/images.png";
import { NavigateFunction, useNavigate } from "react-router-dom";


interface Page {
    page: string;
  }

export default function Header(props: Page) {
    const navigate: NavigateFunction = useNavigate();
    const page: string  = props.page;
    const selectedStyle: string = "px-5 py-2 mx-1 rounded-lg bg-gray-700 hover:bg-gray-700 pointer-events-none";
    const unselectedStyle: string = "px-5 py-2 mx-1 rounded-lg hover:bg-gray-700";

    return (
        <header className="h-20 bg-gray-500 flex text-white pl-10 pr-20">
            <a href="" className="mx-5 my-2">
                <img src={ LibraryIcon } className="h-full object-contain" alt="Library Icon" />
            </a>
            <p className="my-auto text-3xl mx-10">Ryan's Library</p>
            <nav className="flex items-center ml-auto">   
                <button className={page==="Home" ? selectedStyle : unselectedStyle} onClick={() => navigate("/")}>Home</button>
                <button className={page==="Library" ? selectedStyle : unselectedStyle} onClick={() => navigate("/Library")}>Library</button>
                <button className={page==="Add Book" ? selectedStyle : unselectedStyle} onClick={() => navigate("/AddBook")}>Add Book</button>
                <button className={page==="Add Author" ? selectedStyle : unselectedStyle} onClick={() => navigate("/AddAuthor")}>Add Author</button>
            </nav>
        </header>
    )
    
}