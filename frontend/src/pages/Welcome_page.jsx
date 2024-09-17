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


          <Link to ="/admin_dashboard">The admin page</Link> <br /> <br />
          <Link to ="/home">The Home page</Link> <br />

          <Link to ="/jobs">The job page</Link> <br />
          <Link to ="/messages">The messages page</Link> <br />
          <Link to ="/mynetwork">The mynetwork page</Link> <br />
          <Link to ="/notifications">The notifications page</Link> <br />
          <Link to ="/otherprofile">The otherprofile page</Link> <br />
          <Link to ="/profile">The profile page</Link> <br />
          <Link to ="/settings">The settings page</Link> <br />





          {/* <a href="./Jobs/index.html">Jobs</a> <br />
          <a href="./Messages/index.html">Messages</a> <br />
          <a href="./MyNetwork/index.html">MyNetwork</a> <br />
          <a href="./Notifications/index.html">Notifications</a> <br />
          <a href="./OtherProfile/index.html">OtherProfile</a> <br />
          <a href="./Profile/index.html">Profile</a> <br />
          <a href="./Settings/index.html">Settings</a> <br /> */}

        </div>
      </div>
      <div className="right-box">
        <img src={sitting_man} alt="Right Side Image" />
      </div>
    </div>
  );
}

export default Welcome;
