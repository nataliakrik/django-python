import React, { useState } from 'react';

function PersonalDetails() {
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');
    const [isExperiencePublic, setIsExperiencePublic] = useState(false);
    const [isEducationPublic, setIsEducationPublic] = useState(false);
    const [isSkillsPublic, setIsSkillsPublic] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Λογική υποβολής των δεδομένων
        console.log({
            experience,
            education,
            skills,
            privacy: {
                experience: isExperiencePublic ? 'Public' : 'Private',
                education: isEducationPublic ? 'Public' : 'Private',
                skills: isSkillsPublic ? 'Public' : 'Private',
            },
        });
    };

    return (
        <div>

            <div className="top-bar"> 
            <a href="./home" className="top-bar-link">Home Page</a>
            <a href="./Jobs/index.html" className="top-bar-link">Jobs</a>
            <a href="./Messages/index.html" className="top-bar-link">Messages</a>
            <a href="./MyNetwork/index.html" className="top-bar-link">My Network</a>
            <a href="./Notifications/index.html" className="top-bar-link">Notifications</a>
            <a href="./profile" className="top-bar-link">Profile</a>
            <a href="./settings" className="top-bar-link">Settings</a>
        </div>

            <form onSubmit={handleSubmit}>
                <h2>Προσωπικά Στοιχεία</h2>

                <label htmlFor="experience">Επαγγελματική Εμπειρία:</label>
                <textarea
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                />
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={isExperiencePublic}
                        onChange={() => setIsExperiencePublic(!isExperiencePublic)}
                    />
                    Δημόσιο
                </label>

                <br />
                <label htmlFor="education">Εκπαίδευση:</label>
                <textarea
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                />
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={isEducationPublic}
                        onChange={() => setIsEducationPublic(!isEducationPublic)}
                    />
                    Δημόσιο
                </label>

                <br />
                <label htmlFor="skills">Δεξιότητες:</label>
                <textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={isSkillsPublic}
                        onChange={() => setIsSkillsPublic(!isSkillsPublic)}
                    />
                    Δημόσιο
                </label>

                <br />
                <button type="submit">Αποθήκευση</button>
            </form>
        </div>
    );
}

export default PersonalDetails;
