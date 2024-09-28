import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/Jobs.css";
import "../styles/basic_stuff.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem('access');  // Token for API calls

  useEffect(() => {
    const GetTheJobs = async () => {
      try {
        const response = await api.get("api/jobs/",{
          user_id: null
        },{
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setJobs(response.data); // Set the jobs from the response data
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        alert("Something went wrong");
      }
    };
    GetTheJobs();
  }, []);
  const handleApplication = async (job_id) => {
    try {
      const response = await api.post('/api/jobs/options/', {
          job_id: job_id  // Ensure job_id is passed correctly
        }, {
          headers: { Authorization: `Bearer ${token}` },  // Token for authorization
      });
      console.log(response);
      window.location.reload();  // Reload the page to update job status
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Something went wrong");
    }
  }
  

  return (
    <div>
      <div className="top-bar">
        <Link to="/home" className="top-bar-link">Home page</Link>
        <Link to="/jobs" className="top-bar-link">Jobs</Link>
        <Link to="/messages" className="top-bar-link">Messages</Link>
        <Link to="/mynetwork" className="top-bar-link">My Network</Link>
        <Link to="/notifications" className="top-bar-link">Notifications</Link>
        <Link to="/profile" className="top-bar-link">Profile</Link>
        <Link to="/settings" className="top-bar-link">Settings</Link>
      </div>
      <h1 className="center">Jobs</h1>
      <Link to="/postjob">Post a job</Link> <br /> <br />

      {/* Display job listings */}
      {jobs.map((job, index) => (
        <div key={job.id || index}>  
          <div className="Job_frame">
            Job title: {job.title} <br />
            Required skills: {job.requested_skills} <br />
            Company: {job.company} <br />
            Location: {job.location} <br />
            Job type: {job.job_type} <br />
            General Information: {job.general_information}{" "}
            <button onClick={() => handleApplication(job.id)}>Apply for job</button>
          </div>
          <br /> <br />
        </div>
      ))}
    </div>
  );
}

export default Jobs;
