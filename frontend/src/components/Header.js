import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import {ethers} from 'ethers';

function Header() {
    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);
    }

    return <Box component="div">
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    DeFI
                </Typography>
                <Button color="inherit">
                    <Link to="/">Home</Link>
                </Button>
                <Button color="inherit" onClick={connect}>
                    Connect
                </Button>
            </Toolbar>
        </AppBar>
    </Box>
}

export default Header;