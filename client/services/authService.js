import api from "./api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} role - User's role (patient/doctor)
   * @returns {Promise} Registration response with email
   */
  register: async (name, email, password, role = "patient") => {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Invalid email address");
      }

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify OTP
   * @param {string} email - User's email
   * @param {string} otp - 6-digit OTP
   * @returns {Promise} Verification response
   */
  verifyOTP: async (email, otp) => {
    try {
      if (!email || !otp) {
        throw new Error("Email and OTP are required");
      }

      if (otp.length !== 6 || isNaN(otp)) {
        throw new Error("OTP must be 6 digits");
      }

      const response = await api.post("/auth/otp-verification", {
        email,
        otp,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Resend OTP to user email
   * @param {string} email - User's email
   * @returns {Promise} Resend response
   */
  resendOTP: async (email) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await api.post("/auth/resend-otp", {
        email,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Remember user for 30 days
   * @returns {Promise} Login response with token and user data
   */
  login: async (email, password, rememberMe = false) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Remember me functionality - store in localStorage for 30 days
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("loginEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("loginEmail");
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   * Clears all stored auth data
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("registrationEmail");
    localStorage.removeItem("registrationRole");
  },

  /**
   * Get current logged-in user
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  /**
   * Get stored JWT token
   * @returns {string|null} JWT token or null if not stored
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists and user is logged in
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
  },

  /**
   * Get remember me flag
   * @returns {boolean} True if user should stay logged in
   */
  isRemembered: () => {
    return localStorage.getItem("rememberMe") === "true";
  },

  /**
   * Get stored login email (for remember me)
   * @returns {string|null} Email or null
   */
  getRememberedEmail: () => {
    return localStorage.getItem("loginEmail");
  },
};
