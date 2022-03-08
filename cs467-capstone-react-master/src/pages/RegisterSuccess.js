import React from 'react';
import '../index.css'
import confetti from "canvas-confetti";
import { useEffect } from 'react';

export default function RegisterSuccess() {
  
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
        <h2> Registration Complete! </h2>
        <h2> Thanks for joining </h2>
        <h1>Bike Kollective</h1>
        
      </div>
  </div>      
  )
}