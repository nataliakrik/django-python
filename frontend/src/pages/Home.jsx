import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import api from "../api"; 
//import Note from '../components/Note'
import "../styles/Note.css"

function Home(){

    const [users, setUsers] = useState([]);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
    const token = localStorage.getItem('access');  // Assume token is stored in localStorage after login

    useEffect(() => {
        const fetch_Username_photo = async () => {
            try {
                // Calling api.get with 'api/usernameAndPhoto/' path and the token authorization to gain access to the username and photo
                const response = await api.get('api/usernameAndPhoto/', {headers: {Authorization: `Bearer ${token}`,},});

                // Saving the response data
                const usersData = response.data;
                setUsers(usersData);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetch_Username_photo();  // Call the function 
        
    }, [token]);
    
    // Display a loading message if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display an error message if there was an issue fetching data
    if (error) {
        return <div>Error: {error}</div>;
    }

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
    
    return <div className="home">
        <div className="top-bar"> 
            <Link to ="/home" className="top-bar-link">Home page</Link>
            <Link to ="/jobs" className="top-bar-link">Jobs</Link>
            <Link to ="/messages" className="top-bar-link">Messages</Link>
            <Link to ="/mynetwork" className="top-bar-link">My Network</Link>
            <Link to ="/notifications" className="top-bar-link">Notifications</Link>
            <Link to ="/profile" className="top-bar-link">Profile</Link>
            <Link to ="/settings" className="top-bar-link">Settings</Link>
        </div>
        <h1>Home</h1>

        {/* i need to fetch from the api:
        his name, users photo, αρθρα (απο τον ιδιο,
        απο τους φιλους του, απο likes φιλων) */}

        {/* -πλαισιο με το ονομα + link στο προφιλ του χρηστη
        , link για το δικτυο του
        -απο κατω στο κεντρο εχει αρθρα */}
        <div className="profile">
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        user details:
                        <br />
                        profile picture : 
                        <img
                            src={user.profile_picture}
                            alt={user.username}
                            style={{ width: '100px', height: '100px' }}
                            />
                        <br />
                        <span style={{ color: 'black' }}>username: {user.username}</span>
                  </li>
                ))}
            </ul>
        </div>



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
    </div>;
}

export default Home