import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await axios.get('/api/authors');
                if (response.status === 200) {
                    const authors = await response.data;
                    setAuthors(authors.authors);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAuthors();
    }, [authors]);

    const handleAuthorDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const authorId = event.currentTarget.value;
        if (window.confirm(`Are you sure you want to delete the author with id: ${authorId}?`)) {
            try {
                const response = await axios.delete(`/api/authors/${authorId}`);
                console.log(response.data);
                // Re-render the table here
                const fetchAuthors = async () => {
                    const response = await axios.get('/api/authors');
                    const authors = await response.data;
                    setAuthors(authors.authors);
                };
                fetchAuthors();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Author No.', width: 150, headerAlign: "center" },
        { field: 'name', headerName: 'Author Name', width: 250, headerAlign: "center" },
        { field: 'bio', headerName: 'Author Bio', width: 300, headerAlign: "center", sortable: false, filterable: false },
        { field:
            'action',
            headerName: '',  
            width: 120,
            headerAlign: "center",
            //renderCell: (params) => <UserActions {...{params, rowid, setRowId}} />
            renderCell: (params) => {
                return <>
                    <button 
                        value={params.id} 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                        onClick={handleAuthorDelete}><DeleteIcon /></button>
                    </>
            }
        }, 
      ];

    const rows = Array.isArray(authors) ? authors.map((row) => ({
        id: row.id,
        name: row.name,
        bio: row.bio,
    })) : [];

    return (
        <>
            {   
                isLoggedIn?
                <div className="px-20 mx-auto my-10">
                    <h2 className="text-2xl font-bold mb-5">Authors</h2>
                    <div style={{ height: 700, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            //checkboxSelection
                        />
                    </div>
                </div>
                :
                <div className="px-20 mx-auto my-10">
                    <h2 className="text-2xl font-bold mb-5">Authors</h2>
                    <p className="text-lg">You are not logged in. Please log in to view the authors.</p>
                </div>
            }
        </>
    );
};

export default AuthorTable;
