import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();
  const SubmitHandler = async (e) => {
    e.preventDefault();
    const obj = {
      job_title: e.target.elements.job_title.value,
      company: e.target.elements.company.value,
      workplace_type: e.target.elements.workplace_type.value,
      location: e.target.elements.location.value,
      job_type: e.target.elements.job_type.value,
      general_information: e.target.elements.general_information.value,
    };
    // api call (POST method)
    const response = await fetch("api_endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    // check if its ok
    if (!response.ok) {
      alert("something is wrong");
    } else {
      navigate("/jobs");
    }
    e.target.reset();
  };

  //   -job_title
  //   -company
  //   -workplace_type
  //   -location
  //   -job_type (full/part time)
  //   -general_information (all the 6 text type)

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
        <label htmlFor="third">Workplace type:</label>
        <br />
        <input type="text" id="third" name="workplace_type" required />
        <br />
        <label htmlFor="forth">Location:</label>
        <br />
        <input type="text" id="forth" name="location" required />
        <br />
        <label htmlFor="fifth">Job type:</label>
        <br />
        <input type="text" id="fifth" name="job_type" required />
        <br />
        <label htmlFor="sixth">General Information:</label> <br />
        <input
          type="text"
          id="sixth"
          name="general_information"
          required
        />{" "}
        <br />
        <button type="submit">Post Your Job</button>
      </form>
    </div>
  );
}

export default PostJob;
