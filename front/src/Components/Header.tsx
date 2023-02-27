import React, { FC, useState, useEffect } from "react";
import LibraryIcon from "../Images/images.png";
import { NavigateFunction, useNavigate, Location, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import axios from "axios";
import { FormGroup, FormControl, InputLabel, Input, Button } from "@mui/material";
import { Alert, AlertTitle } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSignIn } from "react-auth-kit";

interface Props {
    message: string;
    isSuccess: boolean;
}

interface MessageResponse {
    message: string;
    token: string;
}

type ErrorsResponse = { errors: string[] };

// don't throw error if status code not 200 level
axios.defaults.validateStatus = () => true;

function ActionAlerts(props: Props) {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (props.message) {
            setIsOpen(true);
            closeAlertInThreeSeconds();
        } else {
            setIsOpen(false);
        }
      }, [props.message]);

    const closeAlertInThreeSeconds = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    };

    return (
        <Stack  sx={{ width: '100%' }} spacing={2}>
            {isOpen && (
                <Alert onClose={() => setIsOpen(false)} severity={props.isSuccess===true? 'success' : 'error'}>
                    {props.message}
                </Alert>
            )}
        </Stack>
    );
}

const LoginForm: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginMessage, setLoginMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("isLoggedIn"))
      );
    const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();
    const signIn = useSignIn();

    useEffect(() => {
        setLoginMessage("");
    }, [username, password]);


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
                withCredentials: true,
            });
            
            signIn({
                token: response.data.token,
                expiresIn: 1800,
                tokenType: "Bearer",
                authState: { username: username }
            })

            if (response.status === 200) {
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
                setLoginMessage(response.data.message);
            } 
            else {
                if (response.status === 429) {
                    setLoginMessage("Too many login attempts. Please try again in a minute.");
                    
                }else {
                    setLoginMessage(response.data.message);
                }
            }
        } catch (error) {
            setLoginMessage("Login failed");
            console.error(error);
        }
    };

    const handlelLogout = async () => {
        console.log("logout");
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        await axios({
            method: "post",
            url: "/logout",
        });
    }

    return (
        isLoggedIn? 
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
            <ActionAlerts message={loginMessage} isSuccess={isLoggedIn} />
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
            <ActionAlerts message={loginMessage} isSuccess={isLoggedIn} />

            <FormControl required sx={{ mx:1 }}>
                <Input
                    // html input attribute
                    name="username"
                    id="username"
                    type="text"
                    value={username}
                    autoComplete="off"
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

function Header() {
    const location: Location = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const isSelected = (path: string) => {
        return location.pathname === path ? "bg-gray-700 pointer-events-none" : "hover:bg-gray-700";
      };

    return (
        <header className="h-20 bg-gray-500 flex text-white pl-10 pr-32">
            <a href="/" className="mx-5 my-2">
                <img src={ LibraryIcon } className="h-full object-contain" alt="Library Icon" />
            </a>
            {/* <p className="my-auto text-3xl mx-10">Ryan's Library</p> */}
            <nav className="flex items-center mx-20">
                <button
                    className={`px-5 py-2 mx-1 rounded-lg ${isSelected("/")}`}
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
                <button
                    className={`px-5 py-2 mx-1 rounded-lg ${isSelected("/Library")}`}
                    onClick={() => navigate("/Library")}
                >
                    Library
                </button>
                <button
                    className={`px-5 py-2 mx-1 rounded-lg ${isSelected("/AddBook")}`}
                    onClick={() => navigate("/AddBook")}
                >
                    Add Book
                </button>
                <button
                    className={`px-5 py-2 mx-1 rounded-lg ${isSelected("/AddAuthor")}`}
                    onClick={() => navigate("/AddAuthor")}
                >
                    Add Author
                </button>
            </nav>
            <LoginForm />
        </header>
    )
}

export default Header;