import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Me.css";
import "../styles/Home.css";

function Me() {
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [isExperiencePublic, setIsExperiencePublic] = useState(false);
  const [isEducationPublic, setIsEducationPublic] = useState(false);
  const [isSkillsPublic, setIsSkillsPublic] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("access");

  // get user details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get("api/user/details/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const {
          experience,
          education,
          skills,
          experience_public,
          education_public,
          skills_public,
        } = response.data;

        // adding to the form existing details if they have any so you can make changes according to those
        setExperience(experience || "");
        setEducation(education || "");
        setSkills(skills || "");
        setIsExperiencePublic(experience_public || false);
        setIsEducationPublic(education_public || false);
        setIsSkillsPublic(skills_public || false);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    fetchDetails();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("experience", experience);
    form.append("education", education);
    form.append("skills", skills);
    form.append("experience_public", isExperiencePublic);
    form.append("education_public", isEducationPublic);
    form.append("skills_public", isSkillsPublic);

    try {
      const response = await api.post(`api/user/details/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Details saved successfully", response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving details", error);
    }
  };

  return (
    <div className="home">
      <div className="PersonalDetails-page">
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
        <div className="Details-container">
          <h1>Personal Information</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-align">
              <label htmlFor="experience">Professional Career:</label>
              <textarea
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={!editMode} // Disabling input if not in edit mode
              />
            </div>
            <br />
            <div className="form-align">
              <label>
                Make it Public
                <input
                  type="checkbox"
                  checked={isExperiencePublic}
                  onChange={() => setIsExperiencePublic(!isExperiencePublic)}
                  disabled={!editMode} // Disable checkbox if not in edit mode
                />
              </label>
            </div>
            <br />
            <div className="form-align">
              <label htmlFor="education">Education:</label>
              <textarea
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <br />
            <div className="form-align">
              <label>
                Make it Public
                <input
                  type="checkbox"
                  checked={isEducationPublic}
                  onChange={() => setIsEducationPublic(!isEducationPublic)}
                  disabled={!editMode}
                />
              </label>
            </div>
            <br />
            <div className="form-align">
              <label htmlFor="skills">Personal Skills and Hobbies:</label>
              <textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <br />
            <div className="form-align">
              <label>
                Make it Public
                <input
                  type="checkbox"
                  checked={isSkillsPublic}
                  onChange={() => setIsSkillsPublic(!isSkillsPublic)}
                  disabled={!editMode}
                />
              </label>
            </div>
            <br />
            {/*  button to switch to edit mode */}
            {!editMode && (
              <button
                className="change-details-button"
                onClick={() => setEditMode(true)}
              >
                Change Details
              </button>
            )}
            {/*  button to save changes */}
            {editMode && (
              <button className="submit-button" type="submit">
                Save
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Me;
