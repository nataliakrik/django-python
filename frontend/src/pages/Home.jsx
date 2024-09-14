import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import api from "../api"; 
import Note from '../components/Note'
import "../styles/Note.css"

function Home(){
    const [notes , setNotes] = useState([]);
    const [content , setContent]= useState("");
    const [title , setTitle]= useState("");

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

    return <div>
        <div className="top-bar"> 
            <a href="./home" className="top-bar-link">Home Page</a>
            <a href="./Jobs/index.html" className="top-bar-link">Jobs</a>
            <a href="./Messages/index.html" className="top-bar-link">Messages</a>
            <a href="./MyNetwork/index.html" className="top-bar-link">My Network</a>
            <a href="./Notifications/index.html" className="top-bar-link">Notifications</a>
            <a href="./profile" className="top-bar-link">Profile</a>
            <a href="./settings" className="top-bar-link">Settings</a>
        </div>
        <div className="notes-title">
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
        </form>
    </div>;
}

export default Home