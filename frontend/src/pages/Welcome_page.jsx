import React from 'react';
import { Link } from 'react-router-dom'; 
import'../styles/Welcome.css';
import logo from '../assets/LinkedIn_Logo.PNG';
import sitting_man from '../assets/SittingMan.PNG'


function Welcome() {
  return (
    <div className='container'>
      <div className='left-box'>
        <img src={logo} alt="Logo" />
        <h1>Welcome to <br /> your <br /> professional community</h1>
        
        <div className='options'>
          <p>You have an account? <Link to="./login">Log in</Link></p>
          <p>You don't have an account yet? <Link to="./register">Make account</Link></p>
        </div>
      </div>
      <div className="right-box">
        <img src={sitting_man} alt="Right Side Image" />
      </div>
    </div>
  );
}

export default Welcome;
