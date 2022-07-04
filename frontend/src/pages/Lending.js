import {Container, TextField, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import CDPABI from "../contracts/CDPABI.json";
import {useState} from "react";
import NFTTokenABI from "../contracts/NFTTokenABI.json";
import Button from "@mui/material/Button";

function Lending() {
  const signer = useSelector(state => state.web3.signer);
  const cdp = new ethers.Contract(contracts.CDP, CDPABI, signer);
  const [lendEth, setLendEth] = useState("1");
  // const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);
  //
  // useEffect(() => {
  //
  // });

  const lend = () => {
    cdp.deposit(ethers.utils.parseEther(lendEth), {value: ethers.utils.parseEther(lendEth)});
  };

  return <>
    <Typography component='h1' variant='h1'>Lending</Typography>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <TextField id="eth" label="ETH" variant="outlined" value={lendEth} onChange={e => setLendEth(e.target.value)}/>
      <Button variant='contained' onClick={lend}>Lend</Button>
    </Container>
  </>
}

export default Lending;
