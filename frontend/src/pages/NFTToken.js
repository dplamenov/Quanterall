import {Typography, Container, TextField, Button} from "@mui/material";
import {useState} from "react";

function NFTToken() {
  const [buyTokens, setBuyTokens] = useState(0);
  const [buyEth, setBuyEth] = useState(0);
  const [saleTokens, setSaleTokens] = useState(0);
  const [saleEth, setSaleEth] = useState(0);

  const setBuyTokensHandler = (e) => {
    setBuyTokens(e.target.value);
    setBuyEth(e.target.value / 1000);
  }

  const setBuyEthHandler = (e) => {
    setBuyEth(e.target.value);
    setBuyTokens(e.target.value * 1000);
  };

  const setSaleEthHandler = (e) => {
    setSaleEth(e.target.value);
    setSaleTokens(e.target.value * 1000);
  };

  const setSaleTokensHandler = (e) => {
    setSaleTokens(e.target.value);
    setSaleEth(e.target.value / 1000);
  };

  const buyHandler = () => {

  };

  const sellHandler = () => {

  }

  return <>
    <Typography component='h1' variant='h1'>NFT Token</Typography>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Buy</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="buy-tokens-input" label="Tokens" variant="outlined" value={buyTokens} onChange={setBuyTokensHandler}/>
          <TextField id="buy-eth-input" label="Eth" variant="outlined" value={buyEth} onChange={setBuyEthHandler}/>
        </Container>
        <p>I will buy {buyTokens} tokens for {buyEth} ETH</p>
        <Button variant='contained' onClick={buyHandler}>Buy</Button>
      </Container>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Sell</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="sell-tokens-input" label="Tokens" variant="outlined" value={saleTokens} onChange={setSaleTokensHandler}/>
          <TextField id="sell-eth-input" label="Eth" variant="outlined" value={saleEth} onChange={setSaleEthHandler}/>
        </Container>
        <p>I will sell {saleTokens} tokens for {saleEth} ETH</p>
        <Button variant='contained' onClick={sellHandler}>Sell</Button>
      </Container>
    </Container>
  </>
}

export default NFTToken;
