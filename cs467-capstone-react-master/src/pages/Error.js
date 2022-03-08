import React from 'react';
import '../index.css'
import { ErrorOutline } from '@material-ui/icons';

export default function Error() {
  
  return (
    <div className='dark'>
      <div className='hero-text' >
        <ErrorOutline style={{ fontSize: 200 }}/>
        <h2> An Error Occurred.</h2>
        <h2>Please try again. </h2>
        
        
      </div>
  </div>      
  )
}