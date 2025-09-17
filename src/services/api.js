import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // futuramente API
  withCredentials: true, // Para uso de cookies (HTTPOnly)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
