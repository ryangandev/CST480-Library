import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


interface Author {
    id: number;
    name: string;
    bio: string;
  }
  
interface Error {
    error: string;
}

type AuthorResponse = Author[] | Error;

const AuthorTable: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorResponse>([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            const response = await axios.get('/api/authors');
            const authors = await response.data;
            setAuthors(authors.authors);
        };

        fetchAuthors();
    }, []);

    const handleAuthorDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Author No.', width: 150, headerAlign: "center" },
        { field: 'name', headerName: 'Author Name', width: 250, headerAlign: "center" },
        { field: 'bio', headerName: 'Author Bio', width: 300, headerAlign: "center" },
      ];

    const rows = Array.isArray(authors) ? authors.map((row) => ({
        id: row.id,
        name: row.name,
        bio: row.bio,
    })) : [];

    return (
        <div className="w-1/2 mx-auto my-10">
            <h2 className="text-2xl font-bold mb-5">Authors</h2>
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
            </div>
            {/* <div className="text-center pt-10">
                {Array.isArray(authors) && authors.length === 0 && (
                    <p className='text-xl'>Authors Table is empty!
                        <br></br>
                        Start by adding an author!
                        </p>
                )}
            </div> */}
        </div>
    );
};

export default AuthorTable;
