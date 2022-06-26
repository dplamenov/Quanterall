import {Typography, Container, TextField, Button} from "@mui/material";
import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import TokenMarketplaceABI from "../contracts/TokenMarketplaceABI.json";
import NFTTokenABI from "../contracts/NFTTokenABI.json";
import {useNavigate} from "react-router-dom";

function NFTToken() {
  const signer = useSelector(state => state.web3.signer);
  const tokenMarketplace = new ethers.Contract(contracts.TokenMarketplace, TokenMarketplaceABI, signer);
  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);

  const [buyTokens, setBuyTokens] = useState(0);
  const [buyEth, setBuyEth] = useState(0);
  const [saleTokens, setSaleTokens] = useState(0);
  const [saleEth, setSaleEth] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [contractTokenBalance, setContractTokenBalance] = useState(0);
  const [provideTokens, setProvideTokens] = useState(0);
  const [provideEths, setProvideEths] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    nftToken.balanceOf(tokenMarketplace.address).then(balance => {
      setLiquidity(ethers.utils.formatEther(balance));
    });

    tokenMarketplace.getBalance().then(balance => {
      setContractBalance(ethers.utils.formatEther(balance));
    });

    tokenMarketplace.getBalanceOfTokens().then(balance => {
      setContractTokenBalance(ethers.utils.formatEther(balance));
    });
  });

  const setBuyTokensHandler = (e) => {
    setBuyTokens(e.target.value);
    const k = (contractBalance * contractTokenBalance);
    setBuyEth((k / (contractTokenBalance - e.target.value) - contractBalance).toFixed(18));
  }

  const setBuyEthHandler = (e) => {
    setBuyEth(e.target.value);
    const k = (contractBalance * contractTokenBalance);
    setBuyTokens(k / (contractBalance - e.target.value) - contractTokenBalance);
  };

  const setSaleEthHandler = (e) => {
    setSaleEth(e.target.value);
    const k = (contractBalance * contractTokenBalance);
    setSaleTokens((k / (contractBalance - e.target.value) - contractTokenBalance).toFixed(18));
  };

  const setSaleTokensHandler = (e) => {
    setSaleTokens(e.target.value);
    const k = (contractBalance * contractTokenBalance);
    setSaleEth(k / (contractTokenBalance - e.target.value) - contractBalance);
  };

  const buyHandler = async () => {
    await tokenMarketplace.buy({value: ethers.utils.parseEther(buyEth.toString())});
    navigate('/profile');
  };

  const sellHandler = async () => {
    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther(saleTokens.toString()));
    await tokenMarketplace.sell(ethers.utils.parseEther(saleTokens.toString()));
    navigate('/profile');
  }

  const provideTokensHandler = (e) => {
    setProvideTokens(e.target.value);
  };

  const provideEthHandler = (e) => {
    setProvideEths(e.target.value);
  };

  const provideLiquidity = async () => {
    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther(provideTokens.toString()));
    await tokenMarketplace.addLiquidity(ethers.utils.parseEther(provideTokens.toString()), {value: ethers.utils.parseEther(provideEths.toString())});
  };

  return <>
    <Typography component='h1' variant='h1'>NFT Token</Typography>
    <p>Available tokens: {Number(liquidity).toFixed(2)} NFTToken</p>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Buy</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="buy-tokens-input" label="Tokens" variant="outlined" value={buyTokens}
                     onChange={setBuyTokensHandler}/>
          <TextField id="buy-eth-input" label="Eth" variant="outlined" value={buyEth} onChange={setBuyEthHandler}/>
        </Container>
        <p>You will buy {Number(buyTokens).toFixed(2)} tokens for {Number(buyEth).toFixed(10)} ETH</p>
        <Button variant='contained' onClick={buyHandler}>Buy</Button>
      </Container>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Sell</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="sell-tokens-input" label="Tokens" variant="outlined" value={saleTokens}
                     onChange={setSaleTokensHandler}/>
          <TextField id="sell-eth-input" label="Eth" variant="outlined" value={saleEth} onChange={setSaleEthHandler}/>
        </Container>
        <p>You will sell {Number(saleTokens).toFixed(2)} tokens for {Number(saleEth).toFixed(10)} ETH</p>
        <Button variant='contained' onClick={sellHandler}>Sell</Button>
      </Container>
    </Container>
    <hr/>
    <Typography component='h2' variant='h2'>Provide liquidity</Typography>
    <Container maxWidth={false} disableGutters sx={{display: 'flex', gap: '15px'}}>
      <TextField id="provide-tokens-input" label="Tokens" variant="outlined" value={provideTokens}
                 onChange={provideTokensHandler}/>
      <TextField id="provide-eth-input" label="Eth" variant="outlined" value={provideEths}
                 onChange={provideEthHandler}/>
      <Button variant='contained' onClick={provideLiquidity}>Provide</Button>
    </Container>
  </>
}

export default NFTToken;
