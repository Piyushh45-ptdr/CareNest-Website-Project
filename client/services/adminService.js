import api from "./api";

export const adminService = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await api.get("/admin/patients");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await api.get("/admin/doctors");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete doctor
  deleteDoctor: async (doctorId) => {
    try {
      const response = await api.delete(`/admin/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const [patients, doctors, appointments] = await Promise.all([
        api.get("/admin/patients"),
        api.get("/admin/doctors"),
        api.get("/appointments"),
      ]);

      return {
        totalPatients: patients.data.count || 0,
        totalDoctors: doctors.data.count || 0,
        totalAppointments: appointments.data.count || 0,
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminService;
