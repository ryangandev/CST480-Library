import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Author {
    id: number;
    name: string;
    bio: string;
  }
  
interface Error {
    error: string;
}

type AuthorResponse = Author[] | Error;

const Authors: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorResponse>([]);

    useEffect(() => {
        const fetchData = async () => {
        const { data } = await axios.get('/api/authors');
        setAuthors(data.authors);
        };

        fetchData();
    }, []);

    return (
        <div className="w-4/5 mx-auto my-10">
            <h2 className="text-2xl font-bold mb-5">Authors</h2>
            <table className="border w-full text-center">
                <thead>
                <tr className="bg-gray-300">
                    <th className="border px-4 py-2 w-1/12">ID</th>
                    <th className="border px-4 py-2 w-4/12">Name</th>
                    <th className="border px-4 py-2 w-7/12">Bio</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(authors) && authors.map((author: Author) => (
                    <tr key={author.id}>
                    <td className="border px-4 py-2">{author.id}</td>
                    <td className="border px-4 py-2">{author.name}</td>
                    <td className="border px-4 py-2">{author.bio}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="text-center pt-10">
                {Array.isArray(authors) && authors.length === 0 && (
                    <p className='text-xl'>Authors Table is empty!
                        <br></br>
                        Start by adding an author!
                        </p>
                )}
            </div>
        </div>
    );
};

export default Authors;
