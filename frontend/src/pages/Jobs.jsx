import { Link } from 'react-router-dom';



function Jobs(){
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
        <h1>Jobs ή Αγγελιες</h1>

        {/*fetch from api:
        αγγελιες φιλων και μη */}

        {/* Το front εμφανιζει:
        -Πλαισιο να κανουμε τη δικια μας αγγελια
        -Αγγελιες φιλων και μη (συμφωνα με τις δεξιοτητες μας) */}

        

    </div>
}

export default Jobs
