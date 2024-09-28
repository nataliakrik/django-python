import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/myNetwork.css";
import "../styles/Home.css";

function MyNetwork() {
  const [currentUser, setCurrentUser] = useState([]); // get current users id
  const [users, setUsers] = useState([]); // List of available users
  const [following, setFollowing] = useState([]); // list of the users we follow
  const [followers, setFollowers] = useState([]); // list of the users that follow current user
  const [requests, setRequests] = useState([]); // list of the follow requests user has sent
  const token = localStorage.getItem("access"); // Token for API calls
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const [filteredUsers, setFilteredUsers] = useState([]); // List of filtered users

  // List of available users to get their id in order to follow them
  //////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/usernames/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  // get users id
  //////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchUsernamePhoto = async () => {
      try {
        const response = await api.get("api/usernameAndPhoto/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = response.data;
        setCurrentUser(usersData);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
        setLoading(false); // Stop loading
      }
    };
    fetchUsernamePhoto(); // Call the function
  }, [token]);

  // Follow/unfollow functionality
  const followUser = async (user) => {
    try {
      const response = await api.post(
        `/api/connections/${currentUser.id}/`,
        {
          connection_id: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Error adding follow:", error);
    }
  };

  const unfollowUser = async (user) => {
    try {
      const response = await api.delete(`/api/connections/${currentUser.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { connection_id: user.id },
      });
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Error when unfollowing:", error);
    }
  };

  // Handle user selection
  const handleUserClick = (user) => {
    if (currentUser.id) {
      setSelectedUser(user);
      followUser(user);
    } else {
      console.error("Current user is not loaded yet.");
    }
  };

  const handleUnfollow = (user) => {
    if (currentUser.id) {
      setSelectedUser(user);
      unfollowUser(user);
    } else {
      console.error("Current user is not loaded yet.");
    }
  };

  // get list of followings
  //////////////////////////////////////////////////////////
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const fetchFollows = async () => {
        try {
          const response = await api.get(
            `/api/connections/${currentUser.id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setFollowing(response.data.following);
          setFollowers(response.data.followers);
          setRequests(response.data.requested);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchFollows();
    }
  }, [token, currentUser]);

  // Filter users based on search term
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]); // No results if less than 3 characters
    }
  }, [searchTerm, users]);

  return (
    <div className="home">
      <div className="top-bar">
        <Link to="/home" className="top-bar-link">
          Home page
        </Link>
        <Link to="/jobs" className="top-bar-link">
          Jobs
        </Link>
        <Link to="/messages" className="top-bar-link">
          Messages
        </Link>
        <Link to="/mynetwork" className="top-bar-link">
          My Network
        </Link>
        <Link to="/notifications" className="top-bar-link">
          Notifications
        </Link>
        <Link to="/profile" className="top-bar-link">
          Profile
        </Link>
        <Link to="/settings" className="top-bar-link">
          Settings
        </Link>
      </div>

      <h1>
        <br />
        MyNetwork page
      </h1>
      <div className="network">
        <div className="profile">
          <h3>Profile details</h3>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Phone number: {currentUser.phone_number}</p>
          <p>Following {following.length} users</p>
          <p>Followers: {followers.length} users</p>
        </div>

        <div className="user_grid">
          <form>
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <br />
          <ul className="user-list">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className={`user-list-item ${
                  selectedUser?.id === user.id ? "active" : ""
                }`}
              >
                {user.username}
                {following.some(
                  (followedUser) => followedUser.username === user.username
                ) ? (
                  <button
                    className="following"
                    onClick={() => handleUnfollow(user)}
                  >
                    Following
                  </button>
                ) : // Check if the user has sent a follow request
                requests.some(
                    (requestedUser) => requestedUser.id === user.id
                  ) ? (
                  <button
                    className="requested"
                    onClick={() => handleUnfollow(user)}
                  >
                    Requested
                  </button>
                ) : (
                  <button
                    className="follow"
                    onClick={() => handleUserClick(user)}
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="followings">
          <p>Following:</p>
          {following.map((user) => (
            <div className="grid-item" key={user.id}>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyNetwork;
