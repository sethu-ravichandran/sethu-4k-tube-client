import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? `${import.meta.env.VITE_BACKEND_URL}/api` // Production API path
    : "http://localhost:3500/api", // Development server
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
