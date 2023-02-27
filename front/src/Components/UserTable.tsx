import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface User {
    id: number;
    username: string;
    role: string;
}

interface Error {
    error: string;
}

type UserData = User[] | Error;

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<UserData>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', { withCredentials: true });
                if (response.status === 200) {
                    const users = await response.data;
                    setUsers(users.users);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log(error);
            }
        }; 
        fetchUsers();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'User No.', width: 150, headerAlign: "center" },
        { field: 'username', headerName: 'Username', width: 150, headerAlign: "center" },
        { field: 'role', headerName: 'Role', width: 150, headerAlign: "center" },
    ];

    const rows = Array.isArray(users) ? users.map((row) => ({
        id: row.id,
        username: row.username,
        role: row.role,
    })) : [];

    return (
        <>
            {
                isLoggedIn ?
                <div className="px-20 mx-auto my-10">
                    <h2 className="text-2xl font-bold mb-5">Users</h2>
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
                    <h2 className="text-2xl font-bold mb-5">Users</h2>
                    <p className="text-lg">You are not logged in. Please log in to view the users.</p>
                </div>
            }
        </>
    );
};

export default UserTable;