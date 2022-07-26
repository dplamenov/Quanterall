import {Container, Typography} from "@mui/material";

function BetaVersion() {
  return <Container disableGutters maxWidth={false} sx={{backgroundColor: 'red', color: 'white', textAlign: 'center'}}>
    <Typography variant='h6' component='p'>Beta version! You can lose money!</Typography>
  </Container>
}

export default BetaVersion;
