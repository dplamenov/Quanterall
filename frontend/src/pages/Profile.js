import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ethers} from 'ethers';
import NFTTokenABI from '../contracts/NFTABI.json';
import contracts from "../contracts/contracts.json";

function Profile() {
  const data = useSelector(state => state.web3);
  const signer = useSelector(state => state.web3.signer);

  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);
  const [balance, setBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');

  useEffect(() => {
    data.provider.getBalance(data.account).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth);
    });

    nftToken.balanceOf(data.account).then((balance) => {
      const parsedBalance = ethers.utils.formatEther(balance)
      setTokenBalance(parsedBalance);
    });
  });

  return <>
    <Typography variant='h1' component='h1'>Profile</Typography>
    <Typography component='p'>Address: {data.account}</Typography>
    <Typography component='p'>Ether balance: {balance} ETH</Typography>
    <Typography component='p'>NFT Token balance: {tokenBalance}</Typography>
  </>
}


export default Profile;
