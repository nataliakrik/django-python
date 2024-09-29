import React from 'react';
import { useState } from "react";
import "../styles/settings.css";
import { Link } from 'react-router-dom';
import api from "../api";
import "../styles/Home.css"


function Settings() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const old_password = e.target.elements.old_password.value;
    const new_password = e.target.elements.new_password.value;

    const obj = {
      new_email: email,
      old_password: old_password,
      new_password: new_password,
    };

    console.log(obj);
    // Update the data in the backend (PUT request)
    const response = await api.put('api/usernameAndPhoto/', 
      JSON.stringify(obj), 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );
    
    
    console.log(response);
    
    if (!response) {
      setMessage("Something went wrong. Please check your current password and try again.");
    } else {
      setMessage("Details updated successfully!");
    }

    e.target.reset();
  }

  return (
    <div className="home">
      <div className="top-bar">          
        <Link to="/home" className="top-bar-link">Home page</Link>
        <Link to="/jobs" className="top-bar-link">Jobs</Link>
        <Link to="/messages/null" className="top-bar-link">Messages</Link>
        <Link to="/mynetwork" className="top-bar-link">My Network</Link>
        <Link to="/notifications" className="top-bar-link">Notifications</Link>
        <Link to="/profile" className="top-bar-link">Profile</Link>
        <Link to="/settings" className="top-bar-link">Settings</Link>
      </div>

      <div className="settings-container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">New Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="old-password">Old Password:</label>
                <input type="password" id="old_password" name="old_password" required />
            </div>
            <div className="form-group">
                <label htmlFor="new-password">New Password:</label>
                <input type="password" id="new_password" name="new_password" required />
            </div>
            <button className="settings-submit" type="submit">Change Details</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Settings;
