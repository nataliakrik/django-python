import React, { useEffect, useState , useRef} from 'react';
import api from '../api';
import { Link, useParams } from 'react-router-dom';
import '../styles/messages.css';

function Messages() {
    const { id } = useParams(); // Get user_id from the URL parameters
    const [users, setUsers] = useState([]);  // List of users
    const [selectedUser, setSelectedUser] = useState(null);  // Track selected user
    const [messages, setMessages] = useState([]);  // Messages between users
    const [newMessage, setNewMessage] = useState('');  // Input for new message
    const token = localStorage.getItem('access');  // Token for API calls
    const messagesEndRef = useRef(null);

    // Scroll to bottom every time messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    // Fetch users to choose with whom to send a message
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("fetch users");
                const response = await api.get(`/api/messages/${0}/`, {  // Use 0 to get users conversations
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                
                console.log(id);

                // Check if user_id exists, then fetch messages for that user
                if (id!="null") {
                    // get user info
                    const response = await api.get('api/usernameAndPhoto/', {
                        headers: { Authorization: `Bearer ${token}`},
                        params: { user_id: id },
                    });
                    const user = response.data;
                    if (user){
                        handleUserClick(user);  // Set the selected user and fetch messages
                    }
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [token, id]);  // Add user_id as a dependency to re-fetch if it changes

    // Fetch messages when a user is selected
    const fetchMessages = async (id) => {
        try {
            const response = await api.get(`/api/messages/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data);  // Set the messages for the conversation
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Handle user selection
    const handleUserClick = (user) => {
        console.log("userClick");
        setSelectedUser(user);  // Update selected user state
        fetchMessages(user.id);  // Fetch the messages for the selected user
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedUser) return;

        try {
            await api.post(`/api/messages/${selectedUser.id}/`, 
            { content: newMessage },
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage('');  // Clear input field
            fetchMessages(selectedUser.id);  // Fetch updated messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='home'>
            <div className="top-bar">          
                <Link to="/home" className="top-bar-link">Home page</Link>
                <Link to="/jobs" className="top-bar-link">Jobs</Link>
                <Link to="/messages" className="top-bar-link">Messages</Link>
                <Link to="/mynetwork" className="top-bar-link">My Network</Link>
                <Link to="/notifications" className="top-bar-link">Notifications</Link>
                <Link to="/profile" className="top-bar-link">Profile</Link>
                <Link to="/settings" className="top-bar-link">Settings</Link>
            </div>
            <div className="messages-container">
                {/* Sidebar for listing users */}
                <div className="sidebar">
                    <h2><br />Users</h2>
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
                                <div ref={messagesEndRef} />
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
                        <p><br /> Please select a user to start messaging.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;
