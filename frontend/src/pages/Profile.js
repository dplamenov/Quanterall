import {Typography} from "@mui/material";
import {useSelector} from "react-redux";

function Profile() {
  const data = useSelector(state => state.web3);

  return <>
    <Typography variant='h1' component='h1'>Profile</Typography>
    <Typography component='p'>Address: {data.account}</Typography>
  </>
}


export default Profile;
