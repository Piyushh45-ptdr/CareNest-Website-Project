import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:6402/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses with comprehensive error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Handle 401 - Unauthorized (token expired or invalid)
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login on next page navigation
      window.location.replace("/login");
      return Promise.reject({
        message: "Session expired. Please login again.",
        status: 401,
      });
    }

    // Handle 403 - Forbidden (user doesn't have permission)
    if (status === 403) {
      return Promise.reject({
        message: data?.message || "You don't have permission to access this resource.",
        status: 403,
      });
    }

    // Handle 404 - Not Found
    if (status === 404) {
      return Promise.reject({
        message: data?.message || "The requested resource was not found.",
        status: 404,
      });
    }

    // Handle 400 - Bad Request (validation errors)
    if (status === 400) {
      return Promise.reject({
        message: data?.message || "Invalid request. Please check your input.",
        status: 400,
      });
    }

    // Handle 500 - Server Error
    if (status === 500) {
      return Promise.reject({
        message: "Server error. Please try again later.",
        status: 500,
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        status: 0,
      });
    }

    // Default error
    return Promise.reject(
      error.response?.data || {
        message: "An error occurred. Please try again.",
      }
    );
  }
);

export default api;
