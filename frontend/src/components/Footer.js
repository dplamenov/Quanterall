import {Container, Typography} from "@mui/material";

function Footer() {
  return <Container disableGutters maxWidth={false} sx={{position: 'fixed', bottom: '0px', left: '15px'}}>
    <Typography variant='p' component='p'>Version: 0.5.1/04.07.2022</Typography>
  </Container>
}

export default Footer;
