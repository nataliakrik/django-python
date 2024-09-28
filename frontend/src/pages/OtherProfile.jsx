import { Link } from "react-router-dom";

function OtherProfile() {
  // get from api the public data from the other user
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
      <h1>Profile of other user</h1>
      {/* print the public information of the user  */}
    </div>
  );
}

export default OtherProfile;
