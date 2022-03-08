import { 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Typography
} from "@material-ui/core";
import { numberFormat } from "./support";
import { UserTokenContext, CheckedOutBikeContext } from "../UserTokenContext";
import { Redirect, useHistory } from 'react-router-dom';
import { useContext } from 'react';

const urlRoot = "https://bike-kollective1.uw.r.appspot.com";

export default function BikeCard({bike, tokenParam}){
  const { token } = useContext(UserTokenContext);
  const { checkedOutBike, setCheckedOutBike } = useContext(CheckedOutBikeContext);
  const history = useHistory();

  const checkoutBike = () => {
    console.log("checkoutBike()");
    const tokenToPass = tokenParam ? tokenParam : token;
    console.log("token: " + token);
    console.log("tokenParam: " + tokenParam);
    console.log("token to pass: " + tokenToPass);
    // update bike (available = False) 
    // update user(has_bike = True) 
    // creates a "ride" on a rides table with user email, bike ID, and start time.
    const formData = {
      bikeID: bike.id,
      userEmail: tokenToPass
    }

    fetch(`${urlRoot}/bikes/checkout`, {
      method: "POST",
      body: JSON.stringify({formData}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then((data) => {
      try {
        console.log("Success: ", data);
        setCheckedOutBike(data.bike);
        // redirect to the ridestatus page,
        // which should show the current ride for the user
        if (history) {
          history.push('/return');
        }
        else {
          return <Redirect to="/return"/>
        }
      }
      catch (err) {
        console.error(`err: ${err.message}`);
        // pop a modal that says try again?
      }
    },
    (error) => {
      console.error(`error: ${error}`);
      // pop a modal that says try again?
    }
    )
  }

  return(
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia
        component="img"
        alt="bicycle"
        height="250"
        image={bike.image_url_large}
      />
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          Walking Distance:<span>&nbsp;</span>{numberFormat(bike.distance)} miles 
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          Type:<span>&nbsp;</span>{bike.type} 
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          Speeds:<span>&nbsp;</span>{bike.num_speeds} 
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          Basket:<span>&nbsp;</span>{bike.basket ? <>Yes</> : <>No</>}
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          Cargo Rack:<span>&nbsp;</span>{bike.cargo_rack ? <>Yes</> : <>No</>}
        </Typography>
      </CardContent>
      <CardActions>
        { <Button 
            variant="contained" 
            color= "secondary" 
            size="small"
            onClick={checkoutBike}
          >
            Select this Bike
          </Button>}
      </CardActions>
    </Card>
  )
}