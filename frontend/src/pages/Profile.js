import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ethers} from 'ethers';

function Profile() {
  const data = useSelector(state => state.web3);
  const [balance, setBalance] = useState('');

  useEffect(() => {
    data.provider.getBalance(data.account).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth);
    })
  });

  return <>
    <Typography variant='h1' component='h1'>Profile</Typography>
    <Typography component='p'>Address: {data.account}</Typography>
    <Typography component='p'>Ether balance: {balance} ETH</Typography>
  </>
}


export default Profile;
