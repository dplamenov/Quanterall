import {AppBar, Box, Toolbar, Typography, Button, IconButton} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

function Header() {
    return <Box sx={{ flexGrow: 1 }}>
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
                    Ecommerce
                </Typography>
                <Button color="inherit">
                    <Link to="/">Home</Link>
                </Button>
                <Button color="inherit">
                    <Link to="/products">Products</Link>
                </Button>
                <Button color="inherit">
                    <Link to="/categories">Categories</Link>
                </Button>
                <Button color="inherit">
                    <Link to="/cart">Cart</Link>
                </Button>
            </Toolbar>
        </AppBar>
    </Box>
}

export default Header;