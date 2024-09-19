import React from 'react';
import { Link } from 'react-router-dom';

function MyNetwork(){
    return <div>
        <div className="top-bar">          
                    <Link to ="/home" className="top-bar-link">Home page</Link>
                    <Link to ="/jobs" className="top-bar-link">Jobs</Link>
                    <Link to ="/messages" className="top-bar-link">Messages</Link>
                    <Link to ="/mynetwork" className="top-bar-link">My Network</Link>
                    <Link to ="/notifications" className="top-bar-link">Notifications</Link>
                    <Link to ="/profile" className="top-bar-link">Profile</Link>
                    <Link to ="/settings" className="top-bar-link">Settings</Link>
        </div>
        
        {/* fetch from the api:
        name, sirname, photo, job position, τομεας απασχολησης */}

        {/* το front:
        -εχει μια search bar
        -ενα χωρο εμφανιζονται τα φιλικα προφιλ
        ανα ζευγαρια το ενα κατω απο το αλλο */}
        <h1>MyNetwork page</h1>
    </div>
}

export default MyNetwork

