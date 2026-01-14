import api from "./api";

/**
 * Profile Service
 * Handles all profile-related API calls
 */
export const profileService = {
  /**
   * Get user profile
   * @param {string} userId - User's ID
   * @returns {Promise} User profile data
   */
  getProfile: async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User's ID
   * @param {object} profileData - Profile data to update
   * @returns {Promise} Updated profile data
   */
  updateProfile: async (userId, profileData) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!profileData || typeof profileData !== "object") {
        throw new Error("Profile data is required");
      }

      const response = await api.put(`/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add medical history to user profile
   * @param {string} userId - User's ID
   * @param {object} medicalData - Medical history data
   * @returns {Promise} Updated profile with new medical history
   */
  addMedicalHistory: async (userId, medicalData) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!medicalData || typeof medicalData !== "object") {
        throw new Error("Medical data is required");
      }

      if (!medicalData.condition) {
        throw new Error("Medical condition is required");
      }

      const response = await api.post(
        `/profile/${userId}/medical-history`,
        medicalData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user prescriptions
   * @param {string} userId - User's ID
   * @returns {Promise} Array of prescriptions
   */
  getPrescriptions: async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await api.get(`/prescriptions?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default profileService;
