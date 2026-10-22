import axios from 'axios';

// Resolve Backend API Base URL from Vite environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Configure default Axios baseURL
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

// Ensure cookies are included with cross-origin requests
axios.defaults.withCredentials = true;

export default axios;
