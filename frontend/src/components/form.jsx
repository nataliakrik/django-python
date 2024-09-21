import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/form.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("professional"); // Default role
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [passwordConfirm, setPasswordConfirm] = useState(""); 
    const [email, setEmail] = useState(""); // New field for email
    const [phone_number , setPhone_number] = useState(""); // New field for phone number
    const [img, setImg] = useState(""); // Picture

    const isLogin = method === "login";
    const nameText = isLogin ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        // check here if the passwords match and do not transfer to backend
        if (nameText=="Register" && password !== passwordConfirm) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const data = isLogin 
            ?{username , password , role} 
            : { email, password, passwordConfirm, username, phone_number, role , img};
            
            // Function to recieve tokens in order to login {route ="/api/token/" or ="/api/user/register/"}
            const res = await api.post(route , data);
            if (isLogin) {
                // setting up the tokens value
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                if (role === "admin") {
                    navigate("/admin_dashboard"); // Redirect to admin dashboard if the user is an admin
                } else {
                    navigate("/home"); // Redirect to home page if user is a professional 
                }
            } else {
                ///////////////////////////////////////////
                console.log("Registration successful:", res.data); // Ensure registration works

                // setting up the tokens value
                //const new_route ="/api/token/"
                //const new_data = {username , password , role}

                // call an api post with logins route and data
                const new_res = await api.post("/api/token/", { username, password, role});

                // Get tokens from data that register
                localStorage.setItem(ACCESS_TOKEN, new_res.data.access);
                localStorage.setItem(REFRESH_TOKEN, new_res.data.refresh);

                if (role === "admin") {
                    navigate("/admin_dashboard"); // Redirect to admin dashboard if the user is an admin
                } else {
                    navigate("/home"); // Redirect to home page if user is a professional 
                }
            }
        } catch (error) {
            console.error("Error details:", error.response ? error.response.data : error.message);
            alert("Invalid login credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{nameText}</h1>
            
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {!isLogin &&(
                <>
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        className="form-input"
                        type="phone_number"
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                        placeholder="Phone Number"
                    />
                    <input 
                        className="form-input"
                        type="file"
                        accept="image/*"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        placeholder="Your Image"
                    />
                </>
            )}
            <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="professional">Professional</option>
                <option value="admin">Admin</option>
            </select>

            <button className="form-button" type="submit">{nameText}</button>
        </form>
    );
}

export default Form;
