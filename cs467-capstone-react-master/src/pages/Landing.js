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
          >Join the Kollective
        </Button>
      </div>
  </div>      
  )
}
