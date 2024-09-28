import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../api';
import"../styles/admin.css"

function Admin_dashboard() {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const token = localStorage.getItem('access');  

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users/', { headers: { Authorization: `Bearer ${token}` } });
                const usersData = response.data;

                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                } else {
                    setError('Unexpected data format');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);
    
    // Handle checked user 
    const handleCheckboxChange = (userId) => {
        // Takes previous state
        setSelectedUsers((prev) => {
            // with set we create an object that allows you to store unique values
            const newSelection = new Set(prev);
            if (newSelection.has(userId)) {
                newSelection.delete(userId);
            } else {
                newSelection.add(userId);
            }
            return newSelection;
        });
    };

    const downloadSelectedUsers = (format) => {
        const usersData = users.filter(user => selectedUsers.has(user.id));
        
        if (usersData.length === 0) {
            alert('No users selected');
            return;
        }

        const data = format === 'json' ? JSON.stringify(usersData, null, 2) : convertToXML(usersData);
        
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_users.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const convertToXML = (json) => {
        const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>', '<users>'];

        json.forEach(user => {
            xmlParts.push('  <user>');
            for (const key in user) {
                if (user.hasOwnProperty(key)) {
                    xmlParts.push(`    <${key}>${user[key]}</${key}>`);
                }
            }
            xmlParts.push('  </user>');
        });
        xmlParts.push('</users>');

        return xmlParts.join('\n');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='dashboard-container'>
            <h1>Admin Dashboard</h1>
            <button onClick={() => downloadSelectedUsers('json')}>Download as JSON</button>
            <button onClick={() => downloadSelectedUsers('xml')}>Download as XML</button>
            {users.length > 0 ? (
                <div className='user-list'>
                    {users.map(user => (
                        <div className='user' key={user.id}>
                            <input
                                type="checkbox"
                                checked={selectedUsers.has(user.id)}
                                onChange={() => handleCheckboxChange(user.id)}
                            />
                            <div className='user-bio'>
                                {user.username}
                                <br />
                                {user.email}
                                <br />
                                {user.phone_number}
                            </div>
                            <div className='user-info'>
                                experience : {user.personal_details.experience}
                                <br />
                                education : {user.personal_details.education}
                                <br />
                                skills : {user.personal_details.skills}
                            </div>
                            <div className='users-articles'>
                                {user.my_articles.length > 0 ? (
                                    user.my_articles.map(article => (
                                        <div className="article" key={article.title}>
                                            {!(article.image === 'http://127.0.0.1:8000/media/null') && (
                                                <img className="article-image" src={article.image} alt={article.title} />
                                            )}
                                            <h3>{article.title}</h3>
                                            <Link to={`/article/${article.id}`}>Read more</Link>
                                        </div>
                                    ))
                                ) : (
                                    <p>No articles found</p>
                                )}
                            </div>
                            <div className='users-jobs'>
                                {user.my_jobs.length > 0 ? (
                                    user.my_jobs.map(job => (
                                        <div className="job" key={job.title}>
                                            <h3>{job.title}</h3>
                                            <p>{job.created_at}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No jobs found</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No users found.</div>
            )}
        </div>
    );
}

export default Admin_dashboard;
