import { Link } from 'react-router-dom';

function Notifications(){
    return <div>
        <div className="top-bar">          
                    <Link to ="/home" className="top-bar-link">Home page</Link>
                    <Link to ="/jobs" className="top-bar-link">Jobs</Link>
                    <Link to ="/messages" className="top-bar-link">Messages</Link>
                    <Link to ="/mynetwork" className="top-bar-link">My Network</Link>
                    <Link to ="/notifications" className="top-bar-link">Notifications</Link>
                    <Link to ="/profile" className="top-bar-link">Profile</Link>
                    <Link to ="/settings" className="top-bar-link">Settings</Link>
        </div>
        <h1>Notifications ή ειδοποιησεις</h1>

        {/* fetch from api:
        ολα τα αιτηματα συνδεσης, τα αρθρα που εγιναν like
        , απο ποιον, τα αρθρα που εγιναν comment, απο ποιον
        + ποιο ειναι το comment */}

        {/* Το front εκτυπωνει:
        -(πανω μερος της σελιδας) 
        τα αιτηματα συνδεσης αλλων χρηστων+συνδεσμοι για προφιλ
        -(κατω μερος της σελιδας)
        likes, comments  σε αρθρα */}


    </div>
}

export default Notifications
