import React, {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {ethers} from "ethers";
import {connect} from "./stores/web3";

const PrivateRoute = ({element}) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const account = useSelector(state => state.web3.account);

  const connectCb = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    dispatch(connect({provider, signer: provider.getSigner(), account: accounts[0]}));

    return !!accounts[0];
  };

  useEffect(() => {
    connectCb().then(_ => {
      setIsLoaded(true);
    });
  }, []);

  return isLoaded ? (account ? element : <Navigate to="/"/>) : <h1>loading...</h1>;
}

export default PrivateRoute;
