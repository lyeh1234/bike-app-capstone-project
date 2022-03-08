import { Container } from "@material-ui/core";
import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import Auth from '../components/Auth'

export class App extends Component {
    responseGoogle=(response)=>{
        console.log(response);
        console.log(response.profileObj);
    }
    render() {
        return(
            <Container>
                <div className="header">Sign In with Google Authenticator to Login</div>
                <div>
                <GoogleLogin
                clientId="620401076049-v48l9qasc0uuuiip7jr3sl8jmik5ptpk.apps.googleusercontent.com"
                buttonText="Login"
                
                onSuccess={({accessToken}) => {console.log(accessToken); localStorage.setItem('jwtToken', accessToken)}}
                
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
                />
                </div>
            </Container>
        )
    }
}

export default App
