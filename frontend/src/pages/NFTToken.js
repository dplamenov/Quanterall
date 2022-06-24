import {Typography, Container, TextField, Button} from "@mui/material";
import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import TokenMarketplaceABI from "../contracts/TokenMarketplaceABI.json";
import NFTTokenABI from "../contracts/NFTTokenABI.json";

function NFTToken() {
  const signer = useSelector(state => state.web3.signer);
  const tokenMarketplace = new ethers.Contract(contracts.TokenMarketplace, TokenMarketplaceABI, signer);
  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);

  const [buyTokens, setBuyTokens] = useState(0);
  const [buyEth, setBuyEth] = useState(0);
  const [saleTokens, setSaleTokens] = useState(0);
  const [saleEth, setSaleEth] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [k, setK] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [contractTokenBalance, setContractTokenBalance] = useState(0);

  useEffect(() => {
    nftToken.balanceOf(tokenMarketplace.address).then(balance => {
      setLiquidity(ethers.utils.formatEther(balance));
    });

    tokenMarketplace.getK().then(k => {
      setK(k);
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
    const _k = (contractBalance * contractTokenBalance);
    setBuyEth( (_k / (contractTokenBalance - e.target.value) - contractBalance).toFixed(18));
  }

  const setBuyEthHandler = (e) => {
    setBuyEth(e.target.value);
    const _k = (contractBalance * contractTokenBalance);
    setBuyTokens(_k / (contractBalance - e.target.value) - contractTokenBalance);
  };

  const setSaleEthHandler = (e) => {
    setSaleEth(e.target.value);
    const _k = (contractBalance * contractTokenBalance);
    setSaleTokens((_k / (contractBalance - e.target.value) - contractTokenBalance).toFixed(18));
  };

  const setSaleTokensHandler = (e) => {
    setSaleTokens(e.target.value);
    const _k = (contractBalance * contractTokenBalance);
    setSaleEth(_k / (contractTokenBalance - e.target.value) - contractBalance);
  };

  const buyHandler = () => {
    tokenMarketplace.buy({ value: ethers.utils.parseEther(buyEth.toString()) });
  };

  const sellHandler = async () => {
    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther(saleTokens.toString()));
    await tokenMarketplace.sell(ethers.utils.parseEther(saleTokens.toString()));
  }

  return <>
    <Typography component='h1' variant='h1'>NFT Token</Typography>
    <p>Available tokens: {Number(liquidity).toFixed(2)} NFTToken</p>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Buy</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="buy-tokens-input" label="Tokens" variant="outlined" value={buyTokens} onChange={setBuyTokensHandler}/>
          <TextField id="buy-eth-input" label="Eth" variant="outlined" value={buyEth} onChange={setBuyEthHandler}/>
        </Container>
        <p>I will buy {Number(buyTokens).toFixed(2)} tokens for {Number(buyEth).toFixed(10)} ETH</p>
        <Button variant='contained' onClick={buyHandler}>Buy</Button>
      </Container>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Sell</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="sell-tokens-input" label="Tokens" variant="outlined" value={saleTokens} onChange={setSaleTokensHandler}/>
          <TextField id="sell-eth-input" label="Eth" variant="outlined" value={saleEth} onChange={setSaleEthHandler}/>
        </Container>
        <p>I will sell {Number(saleTokens).toFixed(2)} tokens for {Number(saleEth).toFixed(10)} ETH</p>
        <Button variant='contained' onClick={sellHandler}>Sell</Button>
      </Container>
    </Container>
  </>
}

export default NFTToken;
