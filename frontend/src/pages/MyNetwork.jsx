import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/messages.css';

function MyNetwork(){
    const [users, setUsers] = useState([]);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
    const token = localStorage.getItem('access');  // Assume token is stored in localStorage after login

    useEffect(() => {
        const fetch_Username_photo = async () => {
            try {
                // Calling api.get with 'api/usernameAndPhoto/' path and the token authorization to gain access to the username and photo
                const response = await api.get('api/usernameAndPhoto/', {headers: {Authorization: `Bearer ${token}`,},});

                // Saving the response data
                const usersData = response.data;
                setUsers(usersData);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetch_Username_photo();  // Call the function 
        
    }, [token]);
    
    // Display a loading message if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display an error message if there was an issue fetching data
    if (error) {
        return <div>Error: {error}</div>;
    }

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
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <img
                            src={user.profile_picture}
                            alt={user.username}
                            style={{ width: '100px', height: '100px' }}
                            />
                        <span style={{ color: 'black' }}>{user.username}</span>
                  </li>
                ))}
            </ul>
    </div>
}

export default MyNetwork

