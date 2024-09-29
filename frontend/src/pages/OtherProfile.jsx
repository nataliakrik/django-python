import React, { useEffect } from "react"; 
import { useParams, Link } from 'react-router-dom';
import "./Profile.css"

function OtherProfile() {
  // this is the id of the user u have to print the details about
  const { id } = useParams();

  // get from api the public data from the other user

  // επιστρεφεται ενα object καπως ετσι:
  // data = {
  //   Carrier: value,
  //   Education: value,
  //   Skills_Hobbies: value,
  // };

  let data = {};
  useEffect(() => {
    const getPublicData = async () => {
    //   get method that gives the name and gets
    //   the public data of a user
    try{
        const response = await fetch('api-endpoint',
        {method: "GET",
        headers: {"Content-Type": "application/json",
        "Authorization": `Bearer ${token}`}
      });

      data = await response.json();
    }catch (error){
      alert("error occured");
    }

    };
    getPublicData();
  });
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
      <h1><br />Profile of {id}</h1>

      {/* print the public information of the user  */}
      <div>
        Professional Career: {data.Career} <br /><br />
        Education: {data.Education} <br /><br />
        Personal Skills and Hobbies: {data.Skills_Hobbies} <br /><br />
      </div>
      
    </div>
  );
}

export default OtherProfile;
