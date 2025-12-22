import api from "./api";

export const appointmentService = {
  bookAppointment: async (doctorId, date, time, reason = "") => {
    const response = await api.post("/appointments", {
      doctorId,
      date,
      time,
      reason,
    });
    return response.data.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get("/appointments/patient");
    return response.data.data;
  },

  getDoctorAppointments: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response.data.data;
  },
};
