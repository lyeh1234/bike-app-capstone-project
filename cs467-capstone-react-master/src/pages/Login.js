import { Container } from "@material-ui/core";
import React, { useContext } from "react";
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom'
import { UserTokenContext } from "../UserTokenContext";
import jwt_decode from 'jwt-decode';

export default function Login() {
    const history = useHistory(); 
    const { token, setToken } = useContext(UserTokenContext);
    
    // dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del
    // www.npmjs.com/package/react-google-login
    // github.com/auth0/jwt-decode
    const onSuccess = (res) => {
        console.log(`successful login, user: ${res.profileObj} ${res.tokenId}`);
        const decoded = jwt_decode(res.tokenId);
        console.log("decoded: ");
        console.log(decoded);
        console.log("decoded email: ");
        console.log(decoded.email);
        setToken(decoded.email);
        history.push('/home');  // now got token, user get access
    }

    return(
        <Container>
            <div className="header">Sign In with Google Authenticator to Login</div>
            <div>
                <GoogleLogin
                    clientId="779423136580-3i585g3m8fbiqhp9t7h0nr7if9vpipde.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={onSuccess}
                    // onSuccess={({accessToken}) => {
                    //     console.log("accessToken:");
                    //     console.log(accessToken);
                    //     setToken(accessToken);
                    //     history.push('/home');  // now got token, user get access
                    //     console.log("accessToken:");
                    //     console.log(accessToken);
                    // }}
                    
                    onFailure={() => {}}
                    cookiePolicy={'single_host_origin'}
                    
                />
            </div>
        </Container>
    )
}
