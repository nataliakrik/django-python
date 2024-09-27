import { Link } from "react-router-dom";

function Notifications() {
  // fetch from api:
  // ολα τα αιτηματα συνδεσης, τα αρθρα που εγιναν like
  // , απο ποιον, τα αρθρα που εγιναν comment, απο ποιον
  // + ποιο ειναι το comment

  return (
    <div>
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
      <h1 className="center">Notifications</h1>

      {/* Το front εκτυπωνει:
        -(πανω μερος της σελιδας) 
        τα αιτηματα συνδεσης αλλων χρηστων + συνδεσμοι για προφιλ
        -(κατω μερος της σελιδας)
        likes, comments  σε αρθρα */}

      {/* πανω μερος σελιδας-αιτησεις αλλων χρηστων */}
      <div>
        <h2>Friend requests:</h2>
        <ul>
          <li>
            <Link to="/otherprofile">name1:</Link> accept / deny
          </li>
          <li>name2:</li>
        </ul>
      </div>

      {/*κατω μερος σελιδας-likes, comments*/}
      <div></div>
    </div>
  );
}

export default Notifications;
