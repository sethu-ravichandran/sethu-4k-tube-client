import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "/api" // Production API path
    : "http://localhost:3500/api", // Development server
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
