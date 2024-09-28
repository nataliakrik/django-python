import { useNavigate } from "react-router-dom";
import api from "../api"

function PostJob() {
  const navigate = useNavigate();
  const SubmitHandler = async (e) => {
    e.preventDefault();
    const obj = {
      job_title: e.target.elements.job_title.value,
      company: e.target.elements.company.value,
      requested_skills: e.target.elements.requested_skills.value,
      location: e.target.elements.location.value,
      job_type: e.target.elements.job_type.value,
      general_information: e.target.elements.general_information.value,
      requested_education: e.target.elements.requested_education.value,
    };
    // api call (POST method)
    try {
      const response = await api.post("api/jobs/", obj, {
        headers: { "Content-Type": "application/json" },
      });
  
      // If the response is successful (status code 200)
      if (response.status === 200 || response.status === 201) {
        console.log(response.data); // Optional: log the response to the console
        navigate("/jobs");
      }
    } catch (error) {
      // If the API call failed, you can inspect the error and alert the user
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
    e.target.reset();
  };

  //   -job_title
  //   -company
  //   -workplace_type
  //   -location
  //   -job_type (full/part time)
  //   -general_information (all the 6 text type)
  //   -requested_skills
  //   -requested_education

  return (
    <div>
      <h2>Please enter the form for Job post</h2>
      <form onSubmit={SubmitHandler}>
        <label htmlFor="first">Job title:</label>
        <br />
        <input type="text" id="first" name="job_title" required />
        <br />
        <label htmlFor="second">Company:</label>
        <br />
        <input type="text" id="second" name="company" required />
        <br />
        <label htmlFor="third">Requested Skills:</label>
        <br />
        <input type="text" id="third" name="requested_skills" required />
        <br />
        <label htmlFor="forth">Location:</label>
        <br />
        <input type="text" id="forth" name="location" required />
        <br />
        <label htmlFor="fifth">Job type:</label>
        <br />
        <select id="job_type" name="job_type" required>
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
        </select>
        <br />
        <label htmlFor="sixth">General Information:</label> <br />
        <input
          type="text"
          id="sixth"
          name="general_information"
          required
        />
        <br />
        <label htmlFor="seventh">Requested Education:</label>
        <br />
        <input type="text" id="seventh" name="requested_education" required />
        <br />{" "}
        <br />
        <button type="submit">Post Your Job</button>
      </form>
    </div>
  );
}

export default PostJob;
