import {Typography, Container, TextField, Button} from "@mui/material";
import {useState} from "react";

function NFTToken() {
  const [buyTokens, setBuyTokens] = useState(0);
  const [buyEth, setBuyEth] = useState(0);
  const [saleTokens, setSaleTokens] = useState(0);
  const [saleEth, setSaleEth] = useState(0);

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
          <TextField id="buy-tokens-input" label="Tokens" variant="outlined" value={buyTokens}/>
          <TextField id="buy-eth-input" label="Eth" variant="outlined" value={buyEth}/>
        </Container>
        <p>I will buy COUNT tokens for PRICE eth</p>
        <Button variant='contained' onClick={buyHandler}>Buy</Button>
      </Container>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Sell</Typography>
        <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
          <TextField id="sell-eth-input" label="Eth" variant="outlined" value={saleTokens}/>
          <TextField id="sell-tokens-input" label="Tokens" variant="outlined" value={saleEth}/>
        </Container>
        <p>I will sell COUNT tokens for PRICE eth</p>
        <Button variant='contained' onClick={sellHandler}>Sell</Button>
      </Container>
    </Container>
  </>
}

export default NFTToken;
