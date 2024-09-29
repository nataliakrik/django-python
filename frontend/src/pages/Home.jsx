import { useState, useEffect } from "react";
import { Link, Navigate } from 'react-router-dom'; 
import api from "../api"; 
//import Note from '../components/Note'
import "../styles/Home.css"
//import "./Profile.css"
import red_heart from "../assets/red_heart.png"
import black_heart from "../assets/black_heart.png"

function Home(){

    const [user, setUser] = useState(null);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
    const token = localStorage.getItem('access');  // Assume token is stored in localStorage after login
    const [articles, setArticles] = useState([])
    const [likes, setLikes] = useState([])  // An array of the likes

    useEffect(() => {
        const fetch_Username_photo = async () => {
            try {
                // calling api.get with 'api/usernameAndPhoto/' path and the token authorization to gain access to the id of the current user and send it to the article
                const response = await api.get('api/usernameAndPhoto/',{
                    headers: {Authorization: `Bearer ${token}`,}
                });

                // saving the response data
                const usersData = response.data;
                setUser(usersData);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetch_Username_photo();  // Call the function 
        
    }, [token]);

    // get list of articles if i pass an id i just get an article back if not i get the full list
    //////////////////////////////////////////////////////////
    useEffect(() => {
        if (user && user.id) { 
            console.log(user)
            const fetchArticles = async () => {
                try {
                    const response = await api.get(`api/articles/${user.id}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setArticles(response.data);
                    //console.log(response.data)
                } catch (error) {
                    console.error('Error fetching articles:', error);
                }
            };
            fetchArticles();
        }
    }, [token, user]);



    ////////////////////////////////////////////////////////////////////
    // liking articles

    const likeArticle = async (title) =>{
        try {
            const response = await api.post(`api/articles/likes/${user.id}/`, {
                article_title: title
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLikes(response.data)
            //console.log(response.data)
            window.location.reload();
        }catch{
            console.error('Error when liking article:', error);
        }
    }
    const unlikeArticle = async (title) =>{
        try {
            const response = await api.delete(`api/articles/likes/${user.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { article_title: title }
            });
            setLikes(response.data)
            //console.log(likes)
            window.location.reload();
        }catch{
            console.error('Error when liking article:', error);
        }
    }

    const handleLikes = (title) =>{
        if (title){
            likeArticle(title)
        }else{
            console.error('no title')
        }
    }
    const handleUnLike = (title) =>{
        if (title){
            unlikeArticle(title)
        }else{
            console.error('no title')
        }
    }

    // View article
    
    // display a loading message if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // display an error message if there was an issue fetching data
    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return (
    <div className="home">
        <div className="top-bar"> 
            <Link to ="/home" className="top-bar-link">Home page</Link>
            <Link to ="/jobs" className="top-bar-link">Jobs</Link>
            <Link to ="/messages" className="top-bar-link">Messages</Link>
            <Link to ="/mynetwork" className="top-bar-link">My Network</Link>
            <Link to ="/notifications" className="top-bar-link">Notifications</Link>
            <Link to ="/profile" className="top-bar-link">Profile</Link>
            <Link to ="/settings" className="top-bar-link">Settings</Link>
        </div>
        <br />
        <br />

        <div className="home-container">
            
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
                            <Link to="/profile">@{user.username}</Link>
                            {/* <span style={{ color: 'black' }}> {user.username}</span> */}
                    </li>
                    )}
                </ul>
                <Link to="/mynetwork">Connections <br />Grow your network</Link> <br /> <br />

                <Link to="/postarticle">Post a article</Link>
            </div>
            <div className="right-container">
                <h1>Articles For You</h1>
                <div className="articles-grid">
                    {articles.length > 0 ? (
                        articles.map(article => (
                            <div className="grid-item" key={article.title}>
                                {!(article.image==='http://127.0.0.1:8000/media/null') && (
                                    <img className="article-image" src={article.image} alt={article.title} />
                                )}
                                <h3>{article.title}</h3>
                                <p>{article.likes.length} likes</p>
                                {article.likes.some(like => like.id === user.id) ? (
                                    <button onClick={() => handleUnLike(article.title)}>
                                        <img className="like-button" src={red_heart} alt="Unlike" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleLikes(article.title)}>
                                        <img className="like-button" src={black_heart} alt="Like" />
                                    </button>
                                )}
                                <Link to={`/article/${article.id}`}>Read more</Link> {/* Link to article page */}
                            </div>
                        ))
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>

            </div>
        </div>



    </div>
    )
}

export default Home

//can i view the article i chose to a new read page if so how do i send the title in the new page to get information about the article

        {/* i need to fetch from the api:
        his name, users photo, αρθρα (απο τον ιδιο,
        απο τους φιλους του, απο likes φιλων) */}

        {/* -πλαισιο με το ονομα + link στο προφιλ του χρηστη
        , link για το δικτυο του
        -απο κατω στο κεντρο εχει αρθρα */}

        {/* i print the article here */}
        {/* the variable articles is an array with all the 
        articles that will be printed
        (they have been fetched from the backend) */}
        
        {/* -every article is an object with properties:
        text, file (εικονα ή βιντεο), user (χρειαζομαστε το ονομα του,
        εικονα του και την επαγγελματική εμπειρία)*/}


        {/* articles.forEach(article => {
            article
        }); */}



        {/* <div className="notes-title">
            <h2>
                Notes
            </h2>
            {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id}/>)}
        </div>
        <h2 className="notes-title">
            Create a Note
        </h2>
        <form onSubmit={createNote} className="home-container">
            <label htmlFor="title">Title :</label>
            <br />
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <br />
            <label htmlFor="title" >content :</label>
            <br />
            <textarea 
                id="content" 
                name="content" 
                required 
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br />
            <input
                type="submit"
                value="Submit"
            ></input>
        </form> */}


         /*
    useEffect(() => {
        getNotes();
    }, [])

    const getNotes = () =>{
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data); 
                console.log(data)
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)  // Use backticks here
            .then((res) => {
                if (res.status === 204) {
                    alert("Note deleted!");
                } else {
                    alert("Failed to delete.");
                }
                getNotes();  // Refresh the list of notes after deletion
            })
            .catch((error) => alert(error));
    };
    
    const createNote = (e) =>{
        e.preventDefault();
        api.post("/api/notes/", {content , title}).then((res) =>{
            if (res.status === 201) alert("Noted")
            else alert("Failed to create note.")
            getNotes();
        }).catch((err) => alert(err));
    };

    */