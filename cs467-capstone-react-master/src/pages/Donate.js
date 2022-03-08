// Citation: Credit to "Creating a Material-UI form" (https://onestepcode.com/creating-a-material-ui-form/)
// for information on setting up a Material UI form, particularly handling the form input changes.
import React, {useState, useEffect} from 'react';
import { TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  FormLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  Button,
  Box,
  Typography, 
  Container} from "@material-ui/core";
  import release from '../components/property_release';
  import { useHistory} from 'react-router-dom'


  const defaultInput = {
    
    type: "",
    num_speeds: 1,
    basket: false,
    cargo_rack: false,
    // lock_combo: "",    
  }; 

const urlRoot = "https://bike-kollective1.uw.r.appspot.com";

export default function Donate() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const history = useHistory()
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

  const [chosenFile, setChosenFile] = useState(null);
	
	const fileChangeHandler = (event) => {
		setChosenFile(event.target.files[0]);
		
	};

    const handleSubmit = (event) => {
      event.preventDefault();
      formInput.lat = lat;
      formInput.lng = lng;
      var formData = new FormData();
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('type', formInput.type);
      formData.append('basket', formInput.basket);
      formData.append('cargo_rack', formInput.cargo_rack);
      formData.append('lock_combo', formInput.lock_combo);
      formData.append('num_speeds', formInput.num_speeds);
      formData.append('File', chosenFile);
     
      for (var value of formData.values()) {
        console.log(value);
}      
      fetch(`${urlRoot}/bikes/donate`, {
        method: "POST",
        body: formData,
        
      })
        .then(response => response.json())
        .then(success => {console.log("Success", success);
          history.push('/thanks')})
        .catch(error => {console.error("Error:", error);
          history.push('/error')});
    };

  return(
    
    <Container  >
      <Typography variant="h4"
        component="h5"
        gutterBottom
      > Donation Form
      </Typography>
      <Box
        display = "flex"
        width = "60%"
        mb={2} 
        style={{
        border: "none"}}>    
        <Typography
          variant="body1"
          // component= "body1"
          ><span style={{color:"red", fontWeight: "bold"}}>Important: </span>Please fill out and submit this form where your bike is located so that 
          your mobile device's location may be used to assign a location to the bike in our system.
          <br/>
          Please provide as much information as possible:
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
     
        <div style={{marginBottom: "25px"}}>
        
        <FormControl style={{ minWidth: "240px"}}>
          <InputLabel  id="type_label">Type of Bike</InputLabel>
            <Select
              labelId="type_label"
              name="type"
              value={formInput.type}
              onChange={handleInputChange}
              label="Type of Bike"
            > 
              <MenuItem value="mountain">Mountain Bike</MenuItem>
              <MenuItem value="hybrid">Hybrid Bike</MenuItem>
              <MenuItem value="step-through">Step-Through Frame</MenuItem>
              <MenuItem value="road">Road Bike</MenuItem>
              <MenuItem value="BMX">BMX</MenuItem>
              <MenuItem value="folding">Folding Bike</MenuItem>
              <MenuItem value="unknown">other</MenuItem>
            </Select>
        </FormControl>
     </div>
      <div style={{marginBottom: "30px"}}>
      <FormControl style={{ minWidth: "240px", }}>
      <TextField
            id="speed-input"
            name="num_speeds"
            label="Number of Speeds"
            type="number"
            value={formInput.num_speeds}
            onChange={handleInputChange}
          />
          </FormControl>
        </div>
        <div style={{marginBottom: "20px"}}>
        
        <FormControl>
            <FormLabel >Does the Bike Have a Basket?</FormLabel>
            <RadioGroup
              name="basket"
              value={formInput.basket}
              onChange={handleInputChange}
              row
            >
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
          <div style={{marginBottom: "10px"}}>
        <FormControl>
            <FormLabel>Does the Bike Have a Cargo Rack?</FormLabel>
            <RadioGroup
              name="cargo_rack"
              value={formInput.cargo_rack}
              onChange={handleInputChange}
              row
            >
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
          <div style={{marginBottom: "30px"}}>
          <FormControl style={{ minWidth: "240px", }}>
            <TextField 
              required
              id="combo-input"
              name="lock_combo"
              label="Lock Combination"
              type="text"
            value={formInput.lock_combo}
            onChange={handleInputChange}
          />
          </FormControl>
          </div>
        
        <Typography >Upload an Image of the Bike: &nbsp;&nbsp;
          <input required
            style={{marginBottom: "30px"}}
            type="file" 
            accept="image/*"
            name="file"
            capture="environment"
            onChange={fileChangeHandler}
          />
        </Typography>
      <Box
        display = "flex"
        width = "60%"
        height="200px"
        mb={2} 
        style={{
          border: "2px solid black",
          overflow: "hidden",
          overflowY: "scroll",
        
        }}>
        <>{release}</>
      </Box>
      <FormGroup >
        <FormControlLabel control={<Checkbox required />} label="Checking this box serves as a digital 
        signature on the Property Release Form above" />
      </FormGroup>
      <Button  align="center" variant="contained" color="secondary" type="submit" > 
        Donate
      </Button>
    </form>
    </Container>
    
  )
}

