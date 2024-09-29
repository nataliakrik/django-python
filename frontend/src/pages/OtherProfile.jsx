import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import "./Profile.css"
import api from "../api"

function OtherProfile() {
	const token = localStorage.getItem("access"); // Token for API calls
	const [refresh, setRefresh] = useState(false);
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([])
	// this is the id of the user u have to print the details about
	const { id } = useParams();

	// Get users information
    useEffect(() => {
        const fetch_User = async () => {
			try {
				const response = await api.get('api/usernameAndPhoto/', {
					headers: { Authorization: `Bearer ${token}`},
					params: { user_id: id },
				});

				// saving the response data
				const usersData = response.data;
				setUser(usersData);
				setArticles(usersData.my_articles);
				console.log(usersData);
			} catch (error) {
				console.error('Error fetching users:', error);  // Log error
			}
        };

        fetch_User();  // Call the function 

    }, [token , id]);
	// Check if user data is available before rendering
    if (!user) {
        return <div>Loading...</div>; // Loading state while fetching data
    }

	// επιστρεφεται ενα object καπως ετσι:
	// data = {
	//   Carrier: value,
	//   Education: value,
	//   Skills_Hobbies: value,
	// };
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
			<h1><br />Profile of {user.username}</h1>
			<div className="big-Container">
				<div className="profile-containers">
					<div className="left-container">
						<ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
						{user && (
							<li key={user.id}>
								{/* user details: */}
								<br />
								{/* profile picture :  */}
								<img
								src={user.profile_picture}
								alt={user.username}
								style={{ width: '100px', height: '100px' }}
								/>
								<br /> <br />
								<p>{user.username}</p>
								<p>{user.email}</p>
								<p>{user.phone_number}</p>
								<div className="connection-container">
									<p className="connection-text">{user.username} follows {user.follows.length} users</p>
									
									{/* Hover box with usernames */}
									<div className="hover-box">
										{user.follows.map((user) => (
											<Link
												key={user.id}
												to={`/otherProfile/${user.id}`} // Link to the user's profile page
												className="connection-username"
											>
												@{user.username}
											</Link>
										))}
									</div>
								</div>
								<br />
								<div className="connection-container">
									<p className="connection-text">{user.followers.length} users follow {user.username}</p>
									
									{/* Hover box with usernames */}
									<div className="hover-box">
										{user.followers.map((user) => (
											<Link
												key={user.id}
												to={`/otherProfile/${user.id}`} // Link to the user's profile page
												className="connection-username"
											>
												@{user.username}
											</Link>
										))}
									</div>
								</div>
								{/* <span style={{ color: 'black' }}> {user.username}</span> */}
							</li>
						)}
						</ul>
					</div>
					{/* print the public information of the user  */}
					<div className="personal-details">
						{(user.personal_details.isExperiencePublic)?(
							<p>Career : {user.personal_details.experience} <br /></p>
						):null}
						{(user.personal_details.isEducationPublic)?(
							<p>Education Details : {user.personal_details.education} <br /></p>
						):null}
						{(user.personal_details.isSkillsPublic)?(
							<p>Skills : {user.personal_details.skills} <br /></p>
						):null}
					</div>	
				</div>
				<h2>{user.username}'s Articles</h2>
                <div className="articles-container">
                    {articles.length > 0 ? (
                        articles.map(article => (
                            (article.public)?
							(<div className="grid-item" key={article.id}>
                                {!(article.image==='http://127.0.0.1:8000/media/null') && (
                                    <img className="article-image" src={article.image} alt={article.title} />
                                )}
                                <h3>{article.title}</h3>
                                <div className="likes-container">
                                    <p className="likes-text">{article.likes.length} likes</p>
                                    
                                    {/* Hover box with usernames */}
                                    <div className="hover-box">
                                        {article.likes.map((user) => (
                                            <Link
                                                key={user.id}
                                                to={`/otherProfile/${user.id}`} // Link to the user's profile page
                                                className="like-username"
                                            >
                                                @{user.username} liked
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <br />
                                <Link to={`/article/${article.id}`}>Read more</Link>
                                <button onClick={() => handleDelete(article.id)}>Delete</button>
                            </div>):null
                        ))
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>
			</div>
		</div>
	);
}

export default OtherProfile;
