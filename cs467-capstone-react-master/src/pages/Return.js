// Citation: Credit to "Creating a Material-UI form" (https://onestepcode.com/creating-a-material-ui-form/)
// for information on setting up a Material UI form, particularly handling the form input changes.
import React, {useState, useEffect} from 'react';
import { TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
  Typography, 
  Container
} from "@material-ui/core";
// import { useHistory} from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { useContext } from 'react';
import { UserTokenContext, CheckedOutBikeContext } from "../UserTokenContext";
import { Redirect, useHistory } from 'react-router-dom';

  
const defaultInput = {
  stars: 0,
  operable: true,
  
}; 

const meanings = {
  0.5: 'Unacceptable',
  1: 'Bad',
  1.5: 'Poor',
  2: 'OK',
  2.5: 'Fair',
  3: 'Good',
  3.5: 'Great',
  4: 'Excellent',
  4.5: 'Outstanding!',
  5: 'Perfect!',
};

const urlRoot = "https://bike-kollective1.uw.r.appspot.com";

export default function Return() {
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [meaning, setMeaning]= useState(-1);
  // const [problems, setProblems] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const[showReview, setShowReview] = useState(false);
  const history = useHistory();
  const { token } = useContext(UserTokenContext);
  const { checkedOutBike, setCheckedOutBike } = useContext(CheckedOutBikeContext);

  useEffect(() => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        window.position= position
      },() => {
        alert('Unable to retrieve your location');
      });
    }
    console.log("checkedOutBike: " + checkedOutBike);
    console.log("checkedOutBike.bike: " + checkedOutBike.bike);
  }, [])

  const [formInput, setFormInput] = useState(defaultInput)
  // function to modify state when form values are changed
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormInput({
        ...formInput,
        [name]: value,
      });
    };

    const radioHandler = (showReview) => {
      setShowReview(showReview);
    };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(token);
    var formData = new FormData();
    formData.append('email', token);
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('stars', formInput.stars);
    formData.append('operable', formInput.operable);
    formData.append('feedback', feedback);
        
    for (var value of formData.values()) {
      console.log(value);
    }      
    fetch(`${urlRoot}/bikes/return`, {
      method: "PATCH",
      body: formData,      
    })
      .then(response => response.json())
      .then(success => {
        console.log("Success", success);
        setCheckedOutBike('');
        history.push('/return_success');
      })
      .catch(error => {console.error("Error:", error);
        history.push('/error')});
  };

  return(
    <Container>
      <Typography variant="h4"
        component="h5"
        gutterBottom
      > Bike Return Form
      </Typography>
      <Box
        display = "flex"
        width = "60%"
        mb={2} 
        style={{
        border: "none"}}>    
        <Typography
          variant="body1"
          ><span style={{color:"red", fontWeight: "bold"}}>Important: </span>The app must be allowed to access your location
          in order to determine where you are leaving the bike.
          <br/> 
        </Typography>
      </Box>
    
      <form onSubmit={handleSubmit}>
      
      <Typography component="legend">Please Rate Your Ride:</Typography>
      <Box sx={{display:"flex", mb:3}}>
      <Rating
        name="star rating"
        precision={0.5}
        size="large"
        value={stars}
        onChange={(event, updatedStars) => {
          setStars(updatedStars) ;
          setFormInput({
            ...formInput,
            ["stars"]: updatedStars,
          });
        }} 
        onChangeActive={(event, newMeaning) => {
          setMeaning(newMeaning);
        }}
      />
      {stars !== null && (
        <Box sx={{ mt:1.5, ml: 2 }}>{meanings[meaning !== -1 ? meaning : stars]}</Box>
      )}
      </Box>  
      <div style={{marginBottom: "20px"}}>
        <FormControl >
          <FormLabel >Were there any problems with the bike?</FormLabel>
          <FormLabel >
            <input type="radio" name="review" checked={showReview === true} onClick={(e) => radioHandler(true)} />
            Yes
          </FormLabel>
          <FormLabel>
            <input type="radio" name="review" checked={showReview === false} onClick={(e) => radioHandler(false)} />
            No
          </FormLabel>  
        </FormControl>
      </div>
      {showReview && 
        <Box
          border={1}
          // display = "flex"
          width = "60%"
          mb={2}
          sx={{padding: "10px"}}
        >
          <Typography gutterBottom >Your feedback is very Important. Please provide additional information about the problems with the bike</Typography>
          <br/>
          <div style={{marginBottom: "20px"}}>
            <FormControl>
              <FormLabel >Is the bike operable?</FormLabel>
              <RadioGroup
                name="operable"
                value={formInput.operable}
                onChange={handleInputChange}
                row>
                <FormControlLabel
                  key="true"
                  value="true"
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  key="false"
                  value="false"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </div>        
            <TextField
              onChange={(e) => setFeedback(e.target.value)}
              label="Problem details:"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              color="secondary"
            />
          </Box> }
          {!showReview && null}
        <Button  align="center" variant="contained" color="secondary" type="submit" > 
          Return Bike
        </Button>
      </form>
    </Container>
  )
}
    
  


