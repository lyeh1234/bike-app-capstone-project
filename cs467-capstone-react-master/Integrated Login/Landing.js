import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory} from 'react-router';
import '../index.css'


export default function Landing() {
  const history = useHistory()
  
  return (
    <div className='hero-image'>
      <div className='hero-text'>
        <h2> There is such thing as a </h2>
        <h1>FREE RIDE</h1>
        <Button
          onClick={() => history.push('./Register')}
          size="large"
          variant="contained"
          disableElevation
          color="secondary"
          >GUEST LANDING PAGE REGISTER HERE
        </Button>
      </div>
  </div>      
  )
}



// import React from 'react';
// import auth from '../components/Auth'
// import { Container } from "@material-ui/core";

// export const landing = props => {
//     render() {
//         return (
//             <Container>
//                 <button
//                     onClick={() => {
//                         auth.login(() => {
//                             props.history.push('/app');   // assuming this is app path
//                         });
//                     }}
//                 >
//                     Login
//                 </button>
//             </Container>
//         );
//     }
// }

// export default landing