import React from 'react'
import { useState } from "react";
import api from "../api"; // Υποθέτουμε ότι έχεις μια API instance για τα requests
import "../styles/settings.css"

function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Εδώ μπορείς να κάνεις το αίτημα στην API για ενημέρωση των δεδομένων
    api
      .put("/api/user/update", { email, password })
      .then((response) => {
        setMessage("Τα στοιχεία ενημερώθηκαν επιτυχώς!");
      })
      .catch((error) => {
        setMessage("Σφάλμα κατά την ενημέρωση των στοιχείων.");
      });
  };

  return (
    <div>

      <div className="top-bar"> 
        <a href="./home" className="top-bar-link">Home Page</a>
        <a href="./Jobs/index.html" className="top-bar-link">Jobs</a>
        <a href="./Messages/index.html" className="top-bar-link">Messages</a>
        <a href="./MyNetwork/index.html" className="top-bar-link">My Network</a>
        <a href="./Notifications/index.html" className="top-bar-link">Notifications</a>
        <a href="./profile" className="top-bar-link">Profile</a>
        <a href="./settings" className="top-bar-link">Settings</a>
      </div>

      <div className="settings-container">
        <h2>Ρυθμίσεις</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Νέο Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Νέος Κωδικός:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Αποθήκευση Αλλαγών</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Settings;
