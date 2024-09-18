import React, { useEffect, useState } from 'react';
import api from '../api';
import"../styles/admin.css"

function Admin_dashboard() {
    const [users, setUsers] = useState([]);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
    const token = localStorage.getItem('access');  // Assume token is stored in localStorage after login

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Calling api.get with /api/admin/users/ path and the token authorization to gain access to the users list
                const response = await api.get('/api/admin/users/', {headers: {Authorization: `Bearer ${token}`,},});
                // Saving the response data
                const usersData = response.data;
    
                // Check if response data is an array
                if (Array.isArray(usersData)) {
                    setUsers(usersData);  // Set the users in the state
                } else {
                    setError('Unexpected data format');
                }
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetchUsers();  // Call the function 
    }, [token]);
    
    // Display a loading message if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display an error message if there was an issue fetching data
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='dashboard-container'>
            <h2>Admin Dashboard</h2>
            {users.length > 0 ? (
                <table >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No users found.</div>
            )}
        </div>
    );
}

export default Admin_dashboard;