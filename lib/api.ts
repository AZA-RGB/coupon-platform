import axios from "axios";

const api = axios.create({
  baseURL: "http://164.92.67.78:3002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// // Add request interceptor for auth tokens, etc.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers.Authorization = `Bearer `;
  }
  return config;
});

export default api;
