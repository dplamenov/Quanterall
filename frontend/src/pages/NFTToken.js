import {Typography, Container, TextField} from "@mui/material";

function NFTToken() {
  return <>
    <Typography component='h1' variant='h1'>NFT Token</Typography>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Buy</Typography>
        <TextField id="buy-tokens-input" label="Tokens" variant="outlined" />
        <TextField id="buy-eth-input" label="Eth" variant="outlined"/>
      </Container>
      <Container disableGutters maxWidth={false}>
        <Typography component='h2' variant='h2'>Sell</Typography>
        <TextField id="sell-eth-input" label="Eth" variant="outlined" />
        <TextField id="sell-tokens-input" label="Tokens" variant="outlined"/>
      </Container>
    </Container>
  </>
}

export default NFTToken;
