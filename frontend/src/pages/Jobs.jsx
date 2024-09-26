import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Jobs.css";
import "../styles/basic_stuff.css";

function Jobs() {
  // fetch from api:
  // αγγελιες του χρηστη, των φιλων (συνδεδεμενων με αυτον) αλλα και μη φιλων του
  // που απλα εχουν skills στις αγγελιες
  // τους ιδιες με τα δικα τους (GET method μαναδικη παραμετρος το token)

  // ειναι αντικειμενο που αποτελειται
  // απο εναν πινακα Jobs οπου αυτος
  // αποτελειται απο αντικειμενα οπου καθε ενα απο αυτα εχει σα πεδια:

  // -job_title
  // -skills
  // -company
  // -workplace_type
  // -location
  // -job_type (full/part time)
  // -general_information (all the 6 text type)

  // data_from_fetch = {Jobs : [{
  // job_title: value,
  // skills: value,
  // company: value,
  // workplace: value,
  // location: value,
  // job_type: value,
  // general_information: value,
  // },{},{},...]};

  let data_from_fetch = {
    Jobs: [
      {
        job_title: "",
        skills: "",
        company: "",
        workplace: "",
        location: "",
        job_type: "",
        general_information: "",
      },
    ],
  };
  useEffect(() => {
    const GetTheJobs = async () => {
      const response = await fetch("api-endpoint", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        alert("something went wrong");
      } else {
        data_from_fetch = await response.json();
      }
    };
    GetTheJobs();
  });

  const Jobs = data_from_fetch.Jobs;

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
      <h1 className="center">Jobs</h1>
      {/* Το front εμφανιζει:
        -Πλαισιο να κανουμε τη δικια μας αγγελια
        -Αγγελιες φιλων και μη (συμφωνα με τις δεξιοτητες μας) */}
      <Link to="/postjob">Post a job</Link> <br /> <br />
      {/* εκτυπωνω ολες τις αγγελιες που μου ερχονται */}
      {Jobs.map((Job) => (
        <div>
          <div className="Job_frame">
            {/* {Job.job_title} <br /> {Job.company} <br /> */}
            Job title needed: {Job.job_title} <br />
            The skills required in order to apply: {Job.skills} <br />
            The Job company is: {Job.company} <br />
            The work place will be: {Job.workplace} <br />
            We are located at: {Job.location} <br />
            The job type is: {Job.job_type} <br />
            Some general information about the Job: {
              Job.general_information
            }{" "}
          </div>
          <br /> <br /> <br /> <br />
        </div>
      ))}
    </div>
  );
}

export default Jobs;
