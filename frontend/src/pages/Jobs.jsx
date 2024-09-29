import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/Jobs.css";
import "../styles/basic_stuff.css";
import "../styles/Home.css";

function Jobs() {
	const [jobs, setJobs] = useState([]);
	const token = localStorage.getItem("access"); // Token for API calls

	useEffect(() => {
		const GetTheJobs = async () => {
			try {
				const response = await api.get(
					"api/jobs/",
					{
						params: { user_id: null }, // Pass user_id as a query parameter
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

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
			const response = await api.post(
				"/api/jobs/options/",
				{
					job_id: job_id, // Ensure job_id is passed correctly
				},
				{
					headers: { Authorization: `Bearer ${token}` }, // Token for authorization
				}
			);
			console.log(response);
			window.location.reload(); // Reload the page to update job status
		} catch (error) {
			console.error("Something went wrong:", error);
			alert("Something went wrong");
		}
	};

	return (
		<div className="home">
			<div className="top-bar">
				<Link to="/home" className="top-bar-link">
					Home page
				</Link>
				<Link to="/jobs" className="top-bar-link">
					Jobs
				</Link>
				<Link to="/messages/null" className="top-bar-link">
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
			<div className="job-list">
				<div className="post-job">
					<Link to="/postjob">
						<h3>Post a job</h3>
					</Link> 
				</div>
				<h1 className="center">Job offers for you</h1>
				{/* Display job listings */}
				{jobs.map((job, index) => (
					<div key={job.id || index}>
						<div className="Job_frame">
							<h2>{job.title}</h2>
							<p><h3>General Information</h3><br />{job.general_information}{" "}</p>
							{(job.job_type === "full_time")?(
								<p>It is a full time Job</p>
							):(
								<p>It is a part time Job</p>
							)}
							<p><h4>Required skills </h4>{job.requested_skills}</p>
							<h4>From Company {job.company} </h4>
							<h5>Location: {job.location}</h5>
							<button onClick={() => handleApplication(job.id)}>
								Apply for job
							</button>
						</div>
						<br /> <br />
					</div>
				))}
			</div>
		</div>
	);
}

export default Jobs;
