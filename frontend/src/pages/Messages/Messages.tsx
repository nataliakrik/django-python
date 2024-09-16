import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
    <React.StrictMode>
        <div className="top-bar"> 
        <a href="./home" className="top-bar-link">Home Page</a>
        <a href="./Jobs/index.html" className="top-bar-link">Jobs</a>
        <a href="./Messages/index.html" className="top-bar-link">Messages</a>
        <a href="./MyNetwork/index.html" className="top-bar-link">My Network</a>
        <a href="./Notifications/index.html" className="top-bar-link">Notifications</a>
        <a href="./profile" className="top-bar-link">Profile</a>
        <a href="./settings" className="top-bar-link">Settings</a>
      </div>
        <h1>Messages</h1>
    </React.StrictMode>,
    document.getElementById('root')//dont delete this
)
