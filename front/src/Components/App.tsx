import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home  from "./Home";
import Library from "./Library";
import AddBook from "./AddBook";
import AddAuthor from "./AddAuthor";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Library" element={<Library />} />
                <Route path="/AddBook" element={<AddBook />} />
                <Route path="/AddAuthor" element={<AddAuthor />} />
            </Routes>
        </BrowserRouter>
    )
}
