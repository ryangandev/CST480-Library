import React, { FC, useState } from "react";
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MessageResponse {
    message: string;
}

type EmptyResponse = "";

function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    // necessary for server-side rendering
    // because mode is undefined on the server
    React.useEffect(() => {
    setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }

    return (
        <Button
            variant="outlined"
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'light' ? 'Turn dark' : 'Turn light'}
        </Button>
    );
}

// don't throw error if status code not 200 level
axios.defaults.validateStatus = () => true;

let LoginForm: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginMessage, setLoginMessage] = useState("");
    const navigate = useNavigate();

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
                setLoginMessage("Login successful, redirecting to homepage in 3s...");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setLoginMessage("Login failed");
            }
        } catch (error) {
            setLoginMessage("Login failed");
            console.error(error);
        }
    };

    return (
        <>
            <CssVarsProvider>
                <main>
                    {/* <ModeToggle /> */}
                    <Sheet
                        sx={{
                        width: 300,
                        mx: 'auto', // margin left & right
                        my: 20, // margin top & botom
                        py: 3, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        borderRadius: 'sm',
                        boxShadow: 'md',
                        }}
                        variant="outlined"
                    >
                        <div>
                            <Typography level="h4" component="h1">
                                <b>Welcome!</b>
                            </Typography>
                            <Typography level="body2">Sign in to continue.</Typography>
                        </div>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                // html input attribute
                                name="username"
                                id="username"
                                type="text"
                                value={username}
                                placeholder="username"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                // html input attribute
                                name="password"
                                id="password"
                                type="password"
                                value={password}
                                placeholder="password"
                                onChange={(event) => setPassword(event.target.value) }
                            />
                        </FormControl>

                        <Button 
                            sx={{ mt: 1 /* margin top */ }} 
                            onClick={handleSubmit} >Log in</Button>
                        <Typography
                            endDecorator={<Link href="/">Sign up</Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                            >
                            Don&apos;t have an account?
                        </Typography>
                        <Typography
                            endDecorator={<Link href="/">Continue as a guest</Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                            >
                            Or
                        </Typography>

                        <div className="text-center">{loginMessage}</div>
                    </Sheet>
                </main>
            </CssVarsProvider>
        </>
    );
};

export default function App() {
    return (
        <LoginForm />
    );
}
