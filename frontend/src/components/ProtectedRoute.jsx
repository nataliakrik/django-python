import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
/*
as soon as we load a protected route 
we call the auth function to see if we have a token and it is not expired
we set authorized to true 
if it is expired we need to refresh the token so we wait for that to happen
and as soon as the token is refreshed and then authorized
we build access to that route 

if we are unable to access the route or is unauthorized we navigate back to the login 
*/

function ProtectedRoute({ authorized_page }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        // gets refresh token from localstorage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            // If it is valid set authorized to true
            // And save the new access token
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        // Get access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        // if it doesn't exist the user is not authorized
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        // If it exist we decode with the jwtDecode function
        const decoded = jwtDecode(token);
        // Get the expiration date
        const tokenExpiration = decoded.exp;
        // Get current date
        const now = Date.now() / 1000;

        // Check if the token is expired
        if (tokenExpiration < now) {
            //call refresh function to refresh the token if possible
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    // if is isAuthorized is true navigate to page 
    return isAuthorized ? authorized_page : <Navigate to="/login" />;
}

export default ProtectedRoute;