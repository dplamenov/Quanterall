import * as React from 'react';
import {Card, CardActions, CardContent, CardMedia, Button, Typography} from '@mui/material';
import {ethers} from 'ethers';
import {Link} from "react-router-dom";

function NFT({item}) {
  return <Card>
    <CardMedia
      component="img"
      height="140"
      image={item.image}
      alt={item.title}
      sx={{objectFit: 'contain'}}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {item.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" component='p'>
        Description: {item.description}
      </Typography>
      {item.forSale && <Typography variant="body2" color="text.secondary" component='p'>
        Price: {ethers.utils.formatEther(item.price)} NFTToken
      </Typography>}
    </CardContent>
    <CardActions>
      <Button size="small" variant="contained" to={'/nft/' + item.itemId} component={Link}>
        View
      </Button>
    </CardActions>
  </Card>;
}

export default NFT;
