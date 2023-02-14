import React, { FC, useState } from "react";
import LibraryIcon from "../Images/images.png";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import axios from "axios";
import { FormGroup, FormControl, InputLabel, Input, Button } from "@mui/material";
import { Alert, AlertTitle } from '@mui/material';
import Stack from '@mui/material/Stack';

interface Message {
    message: string;
}

interface MessageResponse {
    message: string;
}

// don't throw error if status code not 200 level
axios.defaults.validateStatus = () => true;

function ActionAlerts(props: Message) {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert onClose={() => {}}>This is a success alert — check it out!</Alert>
            <Alert
                action={
                    <Button color="inherit" size="small">
                    UNDO
                    </Button>
                }
            >
            message
            </Alert>
        </Stack>
    );
  }

const LoginForm: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginMessage, setLoginMessage] = useState("");
    const [isLoggedin, setIsLoggedin] = useState(false);
    const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        try {
            const response = await axios<MessageResponse>({
                method: "post",
                url: "/login",
                data: {
                    username: username,
                    password: password,
                },
            });
            if (response.status === 200) {
                setIsLoggedin(true);
                setLoginMessage("Login successful");
            } else {
                setLoginMessage("Login failed");
            }
        } catch (error) {
            setLoginMessage("Login failed");
            console.error(error);
        }
    };

    const handlelLogout = async () => {
        console.log("logout");
        setIsLoggedin(false);
        await axios({
            method: "post",
            url: "/logout",
        });
    }

    return (
        isLoggedin? 
        <Box
            className="items-center ml-auto"
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                typography: 'button',
                '& > :not(style) + :not(style)': {
                ml: 1,
                },
            }}
            onClick={ preventDefault }
        >
            <Link href="#" underline="always" color="inherit" onClick={handlelLogout} >
            {'Logout'}
            </Link>
        </Box> 
        :
        <Box
            className="items-center ml-auto"
            sx={{
                display: 'flex',

                justifyContent: 'center',
                typography: 'button',
                '& > :not(style) + :not(style)': {
                ml: 1,
                },
            }}
            onClick={ preventDefault }
            >
            <FormControl required sx={{ mx:1 }}>
                <Input
                    // html input attribute
                    name="username"
                    id="username"
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={(event) => setUsername(event.target.value)}
                    sx={{ color: 'white', mx:1, px:1 }}
                />
            </FormControl>
            <FormControl required sx={{ mx:1 }}>
                <Input
                    // html input attribute
                    name="password"
                    id="password"
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(event) => setPassword(event.target.value) }
                    sx={{ color: 'white', mx:1, px:1 }}
                />
            </FormControl>
            <Button 
                sx={{ color: 'white', bgcolor: '#2196f3', px:2, ":hover": { bgcolor: '#1565c0' } }} 
                onClick={handleSubmit} >Log in</Button>
        </Box> 
    )
}

export default function Header() {
    const navigate: NavigateFunction = useNavigate();
    const page: string  = "Home";
    const selectedStyle: string = "px-5 py-2 mx-1 rounded-lg bg-gray-700 hover:bg-gray-700 pointer-events-none";
    const unselectedStyle: string = "px-5 py-2 mx-1 rounded-lg hover:bg-gray-700";

    return (
        <header className="h-20 bg-gray-500 flex text-white pl-10 pr-32">
            <a href="" className="mx-5 my-2">
                <img src={ LibraryIcon } className="h-full object-contain" alt="Library Icon" />
            </a>
            {/* <p className="my-auto text-3xl mx-10">Ryan's Library</p> */}
            <nav className="flex items-center mx-20">   
                <button className={page==="Home" ? selectedStyle : unselectedStyle} onClick={() => navigate("/")}>Home</button>
                <button className={page==="Library" ? selectedStyle : unselectedStyle} onClick={() => navigate("/Library")}>Library</button>
                <button className={page==="Add Book" ? selectedStyle : unselectedStyle} onClick={() => navigate("/AddBook")}>Add Book</button>
                <button className={page==="Add Author" ? selectedStyle : unselectedStyle} onClick={() => navigate("/AddAuthor")}>Add Author</button>
            </nav>
            <LoginForm />
        </header>
    )
}