import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Me.css";
import "../styles/Home.css";

function Me() {
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([])
    const [jobs, setJobs] = useState([])
    const [experience, setExperience] = useState("");
    const [education, setEducation] = useState("");
    const [skills, setSkills] = useState("");
    const [isExperiencePublic, setIsExperiencePublic] = useState(false);
    const [isEducationPublic, setIsEducationPublic] = useState(false);
    const [isSkillsPublic, setIsSkillsPublic] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const token = localStorage.getItem("access");
    // Get users information
    useEffect(() => {
        const fetch_User = async () => {
        try {
            const response = await api.get('api/usernameAndPhoto/', {
            headers: { Authorization: `Bearer ${token}`, }
            });

            // saving the response data
            const usersData = response.data;
            setUser(usersData);
            setArticles(usersData.my_articles);
            setJobs(usersData.my_jobs);
            console.log(user);
        } catch (error) {
            console.error('Error fetching users:', error);  // Log error
        }
        };

        fetch_User();  // Call the function 

    }, [token]);


    // get user personal details
    useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await api.get("api/user/details/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            const {
            experience,
            education,
            skills,
            experience_public,
            education_public,
            skills_public,
            } = response.data;

            // adding to the form existing details if they have any so you can make changes according to those
            setExperience(experience || "");
            setEducation(education || "");
            setSkills(skills || "");
            setIsExperiencePublic(experience_public || false);
            setIsEducationPublic(education_public || false);
            setIsSkillsPublic(skills_public || false);
        } catch (error) {
            console.error("Error fetching user details", error);
        }
        };
        fetchDetails();
    }, [token]);

    // Upload users details
    const handleSubmit = async (e) => {
        e.preventDefault();

    const form = new FormData();
    form.append("experience", experience);
    form.append("education", education);
    form.append("skills", skills);
    form.append("experience_public", isExperiencePublic);
    form.append("education_public", isEducationPublic);
    form.append("skills_public", isSkillsPublic);

    try {
        const response = await api.post(`api/user/details/`, form, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            },
        });
        console.log("Details saved successfully", response.data);
        setEditMode(false);
        } catch (error) {
        console.error("Error saving details", error);
        }
    };

    // Handle articles deletion
    //////////////////////////////////////////////////////////
    
    const deleteArticle = async (id) =>{
        console.log(id)
        try {
            const response = await api.delete(`api/articles/${user.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { article_id: id }
            });
            console.log(response)
        }catch{
            console.error('Error when deleting article:', error);
        }
    }

    const handleDelete = (id) => {
        if(id){
            deleteArticle(id)
        }else {
            console.error('no id')
        }
    }
    ////////////////////////////////////////

    // Handle jobs deletion
    ////////////////////////////////////
    const handleApplication = async (job_id) => {
		try {
			const response = await api.delete("/api/jobs/options/",{
					headers: { Authorization: `Bearer ${token}` }, // Token for authorization,
                    params: { job_id: job_id }
				}
			);
			console.log(response);
		} catch (error) {
			console.error("Something went wrong:", error);
			alert("Something went wrong");
		}
	};

    const handleJobDelete = (id) => {
        if(id){
            handleApplication(id)
        }else {
            console.error('no id')
        }
    }

    return (
    <div className="home">
        <div className="PersonalDetails-page">
            <div className="top-bar">
                <Link to="/home" className="top-bar-link">
                    Home page
                </Link>
                <Link to="/jobs" className="top-bar-link">
                    Jobs
                </Link>
                <Link to="/messages/null" className="top-bar-link">
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
            <div className="big-container">
                <div className="profile-container">
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
                                    <p className="connection-text">You follow {user.follows.length} users</p>
                                    
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
                                    <p className="connection-text">{user.followers.length} users follow you</p>
                                    
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
                        <Link to="/mynetwork">Connections <br />Grow your network</Link> <br /> <br />

                        <Link to="/settings">Change your information</Link> <br /> <br />
                        <Link to="/logout">Logout</Link>
                    </div>
                    <div className="Details-container">
                        <h1>Personal Information</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="form-align">
                                <label htmlFor="experience">Professional Career:</label>
                                <textarea
                                id="experience"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                disabled={!editMode} // Disabling input if not in edit mode
                                />
                            </div>
                            <br />
                            <div className="form-align">
                                <label>
                                Make it Public
                                <input
                                    type="checkbox"
                                    checked={isExperiencePublic}
                                    onChange={() => setIsExperiencePublic(!isExperiencePublic)}
                                    disabled={!editMode} // Disable checkbox if not in edit mode
                                />
                                </label>
                            </div>
                            <br />
                            <div className="form-align">
                                <label htmlFor="education">Education:</label>
                                <textarea
                                id="education"
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                disabled={!editMode}
                                />
                            </div>
                            <br />
                            <div className="form-align">
                                <label>
                                Make it Public
                                <input
                                    type="checkbox"
                                    checked={isEducationPublic}
                                    onChange={() => setIsEducationPublic(!isEducationPublic)}
                                    disabled={!editMode}
                                />
                                </label>
                            </div>
                            <br />
                            <div className="form-align">
                                <label htmlFor="skills">Personal Skills and Hobbies:</label>
                                <textarea
                                id="skills"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                disabled={!editMode}
                                />
                            </div>
                            <br />
                            <div className="form-align">
                                <label>
                                Make it Public
                                <input
                                    type="checkbox"
                                    checked={isSkillsPublic}
                                    onChange={() => setIsSkillsPublic(!isSkillsPublic)}
                                    disabled={!editMode}
                                />
                                </label>
                            </div>
                            <br />
                            {/*  button to switch to edit mode */}
                            {!editMode && (
                                <button
                                className="change-details-button"
                                onClick={() => setEditMode(true)}
                                >
                                Change Details
                                </button>
                            )}
                            {/*  button to save changes */}
                            {editMode && (
                                <button className="submit-button" type="submit">
                                Save
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <h2>My Articles</h2>
                <div className="articles-container">
                    {articles.length > 0 ? (
                        articles.map(article => (
                            <div className="grid-item" key={article.id}>
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
                            </div>
                        ))
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>

                <h2>My jobs</h2>
                <div className="articles-container">
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <div className="grid-item" key={job.id}>
                                <h3>{job.title}</h3>
                                <p>{job.general_information}</p>
                                <div className="likes-container">
                                    <p className="likes-text">{job.applicants.length} people applied for this job</p>
                                    
                                    {/* Hover box with usernames */}
                                    <div className="hover-box">
                                        {job.applicants.map((user) => (
                                            <Link
                                                key={user.id}
                                                to={`/otherProfile/${user.id}`} // Link to the user's profile page
                                                className="like-username"
                                            >
                                                @{user.username} applied
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => handleJobDelete(job.id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No jobs found</p>
                    )}
                </div>

            </div>
        </div>
    </div>
  );
}

export default Me;
