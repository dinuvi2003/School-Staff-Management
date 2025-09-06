import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // backend server

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // include cookies for refresh token if you use them
  headers: { "Content-Type": "application/json" },
});
