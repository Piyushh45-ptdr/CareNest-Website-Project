import api from "./api";

/**
 * Appointment Service
 * Handles all appointment-related API calls
 */
export const appointmentService = {
  /**
   * Book a new appointment
   * @param {string} doctorId - Doctor's ID
   * @param {string} date - Appointment date (YYYY-MM-DD)
   * @param {string} time - Appointment time (HH:mm)
   * @param {string} reason - Reason for appointment
   * @returns {Promise} Appointment data
   */
  bookAppointment: async (doctorId, date, time, reason = "") => {
    try {
      if (!doctorId || !date || !time) {
        throw new Error("Doctor ID, date, and time are required");
      }

      const response = await api.post("/appointments", {
        doctorId,
        date,
        time,
        reason,
      });

      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all appointments for logged-in patient
   * @returns {Promise} Array of appointments
   */
  getPatientAppointments: async () => {
    try {
      const response = await api.get("/appointments/patient");
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all appointments for a doctor
   * @param {string} doctorId - Doctor's ID (optional, defaults to logged-in doctor)
   * @returns {Promise} Array of appointments
   */
  getDoctorAppointments: async (doctorId = null) => {
    try {
      let url = "/appointments/doctor";
      
      // If doctorId is provided, fetch for that specific doctor
      if (doctorId) {
        url = `/appointments/doctor/${doctorId}`;
      }

      const response = await api.get(url);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment ID to cancel
   * @returns {Promise} Cancellation response
   */
  cancelAppointment: async (appointmentId) => {
    try {
      if (!appointmentId) {
        throw new Error("Appointment ID is required");
      }

      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Appointment details with doctor and patient info
   */
  getAppointmentById: async (appointmentId) => {
    try {
      if (!appointmentId) {
        throw new Error("Appointment ID is required");
      }

      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get prescription by ID
   * @param {string} prescriptionId - Prescription ID
   * @returns {Promise} Prescription details with medicines
   */
  getPrescription: async (prescriptionId) => {
    try {
      if (!prescriptionId) {
        throw new Error("Prescription ID is required");
      }

      const response = await api.get(`/appointments/${prescriptionId}/prescription`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update appointment status
   * @param {string} appointmentId - Appointment ID
   * @param {string} status - New status (pending, completed, cancelled, confirmed)
   * @returns {Promise} Updated appointment
   */
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      if (!appointmentId || !status) {
        throw new Error("Appointment ID and status are required");
      }

      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add prescription to appointment
   * @param {string} appointmentId - Appointment ID
   * @param {object} prescriptionData - Prescription data {medicines, notes}
   * @returns {Promise} Created prescription
   */
  addPrescription: async (appointmentId, prescriptionData) => {
    try {
      if (!appointmentId || !prescriptionData) {
        throw new Error("Appointment ID and prescription data are required");
      }

      const response = await api.post(
        `/appointments/${appointmentId}/prescription`,
        prescriptionData
      );
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default appointmentService;
