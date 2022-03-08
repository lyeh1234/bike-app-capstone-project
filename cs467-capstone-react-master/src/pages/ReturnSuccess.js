import React from 'react';
import '../index.css'
import confetti from "canvas-confetti";
import { useEffect } from 'react';

export default function ReturnSuccess() {
  
  useEffect(() => {
    confetti({
      particleCount: 300,
      spread: 90,
      origin: { y: 0.6 }
    });
   
  }, [])
  
  return (
    <div className='dark'>
      <div className='hero-text'>
        <h2> Return Complete! </h2>
        <h2> Thanks for using </h2>
        <h1>Bike Kollective</h1>
        
      </div>
  </div>      
  )
}