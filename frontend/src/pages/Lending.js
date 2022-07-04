import {Container, TextField, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import CDPABI from "../contracts/CDPABI.json";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import NFTTokenABI from "../contracts/NFTTokenABI.json";

function Lending() {
  const signer = useSelector(state => state.web3.signer);
  const cdp = new ethers.Contract(contracts.CDP, CDPABI, signer);
  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);

  const [lendEth, setLendEth] = useState("1");
  const [tokens, setTokens] = useState(0);
  const [maxLend, setMaxLend] = useState(0);

  useEffect(() => {
    cdp.estimateTokenAmount(ethers.utils.parseEther('1')).then(data => {
      setTokens(ethers.utils.formatEther(data));
    });

    nftToken.balanceOf(cdp.address).then(balance => {
      setMaxLend(ethers.utils.formatEther(balance));
    });
  }, []);

  const handleLendEthChange = (e) => {
    if (+e.target.value < 1) {
      return;
    }

    setLendEth(e.target.value);
    cdp.estimateTokenAmount(ethers.utils.parseEther(e.target.value)).then(data => {
      setTokens(ethers.utils.formatEther(data));
    });
  };

  const lend = () => {
    cdp.deposit(ethers.utils.parseEther(lendEth), {value: ethers.utils.parseEther(lendEth)});
  };

  return <>
    <Typography component='h1' variant='h1'>Lending</Typography>
      <Typography component="p" variant='h5'>Deposit ETH to get NFTToken</Typography>
    <p>You can lend up to {Number(maxLend).toFixed(2)} tokens</p>
    <Container disableGutters maxWidth={false} sx={{display: 'flex', gap: '10px'}}>
      <TextField id="eth" label="ETH" variant="outlined" type='number' value={lendEth} onChange={handleLendEthChange}/>
      <Button variant='contained' onClick={lend}>Deposit</Button>
    </Container>
    <p>You will get {Number(tokens).toFixed(2)} tokens</p>

    <h1>SOON...</h1>
  </>
}

export default Lending;
