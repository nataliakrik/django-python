//setting up axios
import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
// the base URL for the backend
// this is the main address where the frontend sends its API requests to interact with the backend
const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";
/*
The baseURL is the root path for all requests. 

When the frontend makes API requests (like a POST to /login or a GET to /notes),
Axios uses the baseURL and combines it with the specific paths to this root, like /login or /users
For example:
api.post('/login', { username, password })
This sends a POST request to the URL /choreo-apis/awbo/backend/rest-api-be2/v1.0/login on the backend (if apiUrl is used as the base URL)
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;