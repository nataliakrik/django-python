import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import '../styles/messages.css';

function Messages() {
    const [users, setUsers] = useState([]);  // List of users
    const [selectedUser, setSelectedUser] = useState(null);  // Track selected user
    const [messages, setMessages] = useState([]);  // Messages between users
    const [newMessage, setNewMessage] = useState('');  // Input for new message
    const token = localStorage.getItem('access');  // Token for API calls

    // Fetch users to choose with who to send message
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

    // Fetch messages when a user is selected
    const fetchMessages = async (user) => {
        try {
            const response = await api.get(`/messages/${user.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data);  // Set the messages for the conversation
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Handle user selection
    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessages(user);  // Fetch the messages for the selected user
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedUser) return;

        try {
            await api.post(`/messages/${selectedUser.id}/`, 
            { content: newMessage },
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage('');  // Clear input field
            fetchMessages(selectedUser);  // Fetch updated messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    //////////////////////////////////////////////////
    return (
        <div >
            <div className="top-bar">          
                    <Link to ="/home" className="top-bar-link">Home page</Link>
                    <Link to ="/jobs" className="top-bar-link">Jobs</Link>
                    <Link to ="/messages" className="top-bar-link">Messages</Link>
                    <Link to ="/mynetwork" className="top-bar-link">My Network</Link>
                    <Link to ="/notifications" className="top-bar-link">Notifications</Link>
                    <Link to ="/profile" className="top-bar-link">Profile</Link>
                    <Link to ="/settings" className="top-bar-link">Settings</Link>
            </div>
            <div className="messages-container">

                {/* Sidebar for listing users */}
                <div className="sidebar">
                    <h2>Users</h2>
                    <ul className="user-list">
                        {users.map(user => (
                            <li
                                key={user.id}
                                className={`user-list-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                {user.username}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat area for displaying messages */}
                <div className="chat-area">
                    {selectedUser ? (
                        <div>
                            <h3>Conversation with {selectedUser.username}</h3>
                            <div className="messages-box">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.sender === selectedUser.username ? 'incoming' : 'outgoing'}`}>
                                            <p>{msg.content}</p>
                                            <small>{msg.sender} - {new Date(msg.created_at).toLocaleString()}</small>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                            </div>
                            {/* Input field for sending new messages */}
                            <div className="message-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </div>
                    ) : (
                        <p>Please select a user to start messaging.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;
