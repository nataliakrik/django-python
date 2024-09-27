import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';
import logo from '../assets/LinkedIn_Logo.PNG';

function Welcome() {
  return (
    <div className="welcome-container">
      {/* Top navigation */}
      <div className="top-nav">
        <p>Don't have an account ? </p>
        <Link to="/register">Create account</Link>
        <Link to="/login">Log in</Link>
      </div>

      <div className='box'>
        <div className='empty-box'>
        </div>
        <div className="content">
          
          <h1 className="welcome-title">Welcome to your professional community</h1>

          {/* Paragraph under the title */}
          <p className="welcome-paragraph">
            Join our community of professionals, connect with peers, and grow your career through meaningful collaborations.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Welcome;
