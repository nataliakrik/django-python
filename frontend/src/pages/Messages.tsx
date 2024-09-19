import { Link } from 'react-router-dom';

function Messages(){
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
        <h1>Message ή Συζητησεις</h1>

        {/* fetch from api:
        -ονομα και εικονα χρηστων που βρισκονται στη λιστα
        -μηνυματα ανοικτης συζητησης (επιλεγμενου προφιλ)
        -(πρωτες λεξεις μηνυματων σε καθε ατομο) */}

        {/* Το front να εμφανιζει:
        -Μια λιστα (στα αριστερα) με τα profile,
        με τα ατομα που υπαρχει ηδη συζητηση
        -Στο κεντρο ανοικτη η συζητηση με το επιλεγμενο ατομο
        απο τη λιστα */}

        

    </div>
}

export default Messages
