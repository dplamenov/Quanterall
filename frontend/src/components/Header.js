import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import {ethers} from 'ethers';
import {useDispatch, useSelector} from "react-redux";
import {connect} from '../stores/web3';

function Header() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.web3);

  const connectHandler = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    dispatch(connect({provider, signer: provider.getSigner(), account: accounts[0]}));
  };

  const ConnectedNavigation = () => {
    return <>
      <Button color="inherit"><Link to="/profile">Marketplace</Link></Button>
      <Button color="inherit"><Link to="/profile">Create</Link></Button>
      <Button color="inherit"><Link to="/profile">Profile</Link></Button>
    </>
  };

  const GuestNavigation = () => {
    return <>
      <Button color="inherit" onClick={connectHandler}>Connect</Button>
    </>
  };

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
        {data.account ? <ConnectedNavigation />:  <GuestNavigation />}
      </Toolbar>
    </AppBar>
  </Box>
}

export default Header;