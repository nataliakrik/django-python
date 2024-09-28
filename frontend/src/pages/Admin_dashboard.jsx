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

        // convert data to json or xml according to choice
        const data = format === 'json' ? JSON.stringify(usersData, null, 2) : convertToXML(usersData);
        // create a Binary Large Object file to store either the json data or xml data   
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'application/xml' });
        // create a new temporary url for the file
        // the URL allows the blob to be used as a downloadable resource
        const url = URL.createObjectURL(blob);
        
        // Create an <a> (anchor) element to dynamically store html in a <a> tag
        const a = document.createElement('a');
        // set the link for the html to be the file
        a.href = url;
        // name of the file will end in json or xml
        a.download = `selected_users.${format}`;
        // add the element in the body of the document
        document.body.appendChild(a);
        // triggers the download to start
        a.click();
        // Remove the elemet from the document
        document.body.removeChild(a);
        // unlink the memory that was stored to prevent it from leaks
        URL.revokeObjectURL(url);
    };
    // Convert the data to xml form
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
        // return data in the xml form
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
            <div className='buttons'>
                <button onClick={() => downloadSelectedUsers('json')}>Download as JSON</button>
                <button onClick={() => downloadSelectedUsers('xml')}>Download as XML</button>
            </div>
            {users.length > 0 ? (
                <div className='user-list'>
                    {users.map(user => (
                        <div className='user' key={user.id}>
                            <div className='input'>
                                <p>Select user to download data</p>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.has(user.id)}
                                    onChange={() => handleCheckboxChange(user.id)}
                                />
                            </div>
                            <div className='first-line'>
                                <div className='user-bio'>
                                    <h3>Users information</h3>
                                    {user.username}
                                    <br />
                                    {user.email}
                                    <br />
                                    {user.phone_number}
                                </div>
                                <div className='users-articles'>
                                    <h3>Users articles</h3>
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
                                    <h3>User jobs</h3>
                                    {user.my_jobs.length > 0 ? (
                                        user.my_jobs.map(job => (
                                            <div className="job" key={job.title}>
                                                <h3>{job.title}</h3>
                                                <p>{job.general_information}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No jobs found</p>
                                    )}
                                </div>
                            </div>
                            {/*////// SECOND LINE ///////////*/}
                            <div className='second-line'>
                                <div className='user-info'>
                                    <h3>Users Professional information</h3>
                                    experience : {user.personal_details.experience}
                                    <br />
                                    education : {user.personal_details.education}
                                    <br />
                                    skills : {user.personal_details.skills}
                                </div>
                                <div className='users-comments'>
                                    <h3>Users comments</h3>
                                    {user.my_comments.length > 0 ? (
                                        user.my_comments.map(comment => (
                                            <div className="comment" key={comment.id}>
                                                <p>User {user.username} </p>
                                                <p>on article {comment.article_id} commented:</p>
                                                <p>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>User has no comments</p>
                                    )}
                                </div>
                                <div className='user-likes'>
                                    <h3>Users likes</h3>
                                    {user.liked_articles.length > 0 ? (
                                        user.liked_articles.map(like => (
                                            <div className="like" key={like.id}>
                                                <p>User {user.username} </p>
                                                <p>liked article with title </p>
                                                <h3>{like.title} </h3>
                                            </div>
                                        ))
                                    ) : (
                                        <p>User did not like any articles</p>
                                    )}
                                </div>
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
