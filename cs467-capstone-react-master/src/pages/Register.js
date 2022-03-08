import { Container,
  Typography, 
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button } from "@material-ui/core";
import React,  {useState, useContext}from "react";
import waiver from '../components/accident_waiver';
import { useHistory, Redirect } from 'react-router-dom';
import { UserTokenContext } from "../UserTokenContext";

const urlRoot = "https://bike-kollective1.uw.r.appspot.com";

export default function Register() {
  const [email, setEmail] = useState('');
  const { token, setToken } = useContext(UserTokenContext);
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append('email', token);
        
    for (var value of formData.values()) {
      console.log(value);
    }      
    fetch(`${urlRoot}/users`, {
      method: "POST",
      body: formData,      
    })
      .then(response => response.json())
      .then(success => {console.log("Success", success);
        history.push('/register_success')})
      .catch(error => {console.error("Error:", error);
        history.push('/error')});
  };

  if (!token) {
    return <Redirect to="/login" />
  }
  else {
    return(
      <Container>
        <Typography variant="h4"
          component="h5"
          gutterBottom
        > Registration Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <div>{token}</div>
          {/* <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email:"
                  min
                  
                  color="secondary"
                  style={{ minWidth: "350px"}}
                  hidden={false}
                /> */}
          {/* <div className="content">
            <div className="form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" placeholder="username"/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="email"/>
              </div>
            </div>
          </div> */}
          
          <Box
            width = "60%"
            height="200px" 
            style={{
              border: "2px solid black",
              overflow: "hidden",
              overflowY: "scroll", 
              marginTop: "25px",
              padding: "10px"
            }}
          >
          <p>{waiver}</p>
          </Box>
          <FormGroup>
            <FormControlLabel control={<Checkbox required />} label="Checking this box serves as a digital 
            signature on the Waiver and Release of Liability above" />
          </FormGroup>
        {/* <div className="footer">
            <button type="button" className="btn">
              Register
            </button>
          </div> */}
          <div style={{marginTop: "20px"}}>
          <Button  align="center" variant="contained" color="secondary" type="submit" > 
            Submit Registration
          </Button>
          </div>
        </form>
      </Container>
    )
  }
}