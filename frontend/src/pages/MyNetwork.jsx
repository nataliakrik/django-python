import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import '../styles/myNetwork.css';

function MyNetwork(){
    // get a list of available users
    // send back the user_id that we want to follow
    // show a list of users we follow
    const [currentUser , setCurrentUser] = useState([]); // get current users id
    const [users , setUsers] = useState([]); // List of available users
    const [following , setFollowing] = useState([]); // list of the users we follow
    const [followers , setfollowers] = useState([]); // list of the users that follow current user
    const token = localStorage.getItem('access');  // Token for API calls
    const [selectedUser, setSelectedUser] = useState(null);  // Track selected user
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
 
    // List of available users to get their id in order to follow them
    //////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/usernames/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [token]);

    // get users id
    //////////////////////////////////////////////////////////
    useEffect(() => {
        const fetch_Username_photo = async () => {
            try {
                // Calling api.get with 'api/usernameAndPhoto/' path and the token authorization to gain access to the username and photo
                const response = await api.get('api/usernameAndPhoto/', {headers: {Authorization: `Bearer ${token}`,},});

                // Saving the response data
                const usersData = response.data[0];
                setCurrentUser(usersData);
                console.log(usersData.id);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetch_Username_photo();  // Call the function 
        
    }, [token]);
    // add the selected user id to the following list
    //////////////////////////////////////////////////////////
    const followUser = async (user) => {
        try {
            //console.log(currentUser);
            const response = await api.post(`/api/connections/${currentUser.id}/`, {
                connection_id: user.id // Ensure the payload is correct
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            window.location.reload();
        } catch (error) {
            console.error('Error adding follow:', error);
        }
    };
    
    const unfollowUser = async (user) => {
        try {
            console.log(currentUser);
            console.log(user)
            const response = await api.delete(`/api/connections/${currentUser.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { connection_id: user.id }  // Send the connection_id as a query parameter
            });
            console.log(response);
            window.location.reload();
        } catch (error) {
            console.error('Error when unfollow:', error);
        }
    };
    
    
    
    // Handle user selection
    const handleUserClick = (user) => {
        console.log(currentUser);
        //console.log(currentUser.id);
        if (currentUser.id) {
            setSelectedUser(user);
            followUser(user);
        } else {
            console.error('Current user is not loaded yet.');
        }
    };

    const handleUnfollow = (user) => {
        //console.log(currentUser.id);
        if (currentUser.id) {
            setSelectedUser(user);
            unfollowUser(user);
        } else {
            console.error('Current user is not loaded yet.');
        }
    };
    
    // get list of followings
    //////////////////////////////////////////////////////////
    useEffect(() => {
        if (currentUser && currentUser.id) {
            const fetchFollows = async () => {
                try {
                    const response = await api.get(`/api/connections/${currentUser.id}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFollowing(response.data.following);
                    setfollowers(response.data.followers)
                    console.log(response.data)
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            fetchFollows();
        }
    }, [token, currentUser]);

    return (

     <div>
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
        <div className='network'>
            <div className='profile'>
                <h3>Profile details </h3>
                <p>username : {currentUser.username}</p>
                <br />
                <p>email : {currentUser.email}</p>
                <br />
                <p>phone_number : {currentUser.phone_number}</p>
                <br />
                <p>following {following.length} users</p>
                <br />
                <p>followers are {followers.length} users</p>
            </div>
            <div className='user_grid'>
                <ul className="user-list">
                    {users.map(user => (
                        <li
                            key={user.id}
                            className={`user-list-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                        >
                            {user.username}
                            {following.some(followedUser => followedUser.username === user.username) ? (
                                <button className='following' onClick={() => handleUnfollow(user)}>Following</button>
                            ) : (
                                <button className='follow' onClick={() => handleUserClick(user)}>Follow</button>
                            ) }
                        </li>
                    ))}
                </ul>
            </div>
            <div className='followers'>
                {following.map(user =>(
                    <div  className="grid-item" key={user.id}>
                        <h3>{user.username}</h3>
                        <p>{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

export default MyNetwork

