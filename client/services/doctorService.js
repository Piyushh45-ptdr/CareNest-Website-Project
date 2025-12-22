import api from "./api";

export const doctorService = {
  getDoctors: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.specialization) {
      params.append("specialization", filters.specialization);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data.data;
  },

  getSpecializations: async () => {
    const response = await api.get("/doctors/specializations");
    return response.data.data;
  },
};
