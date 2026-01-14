import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import appointmentService from "../services/appointmentService";
import { motion } from "framer-motion";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
  });

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    if (!token || user?.role !== "doctor") {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [token, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getDoctorAppointments();
      const allAppointments = response.data || [];

      // Calculate stats
      const today = new Date().toDateString();
      const todayAppts = allAppointments.filter(
        (apt) => new Date(apt.date).toDateString() === today
      );
      const upcomingAppts = allAppointments.filter(
        (apt) => new Date(apt.date) > new Date() && apt.status !== "completed"
      );
      const completedAppts = allAppointments.filter(
        (apt) => apt.status === "completed"
      );
      const patientIds = new Set(allAppointments.map((apt) => apt.patientId));

      setStats({
        totalPatients: patientIds.size,
        todayAppointments: todayAppts.length,
        completedAppointments: completedAppts.length,
        upcomingAppointments: upcomingAppts.length,
      });

      setAppointments(allAppointments.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back, Dr. {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-600">
            Manage your appointments and patient care
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Patients
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalPatients}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats.todayAppointments}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {stats.upcomingAppointments}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Completed Appointments
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats.completedAppointments}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Appointments
                </h2>
                <Button
                  onClick={() => navigate("/doctor/appointments")}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  View All
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No appointments yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(appointment.date)} at{" "}
                          {formatTime(appointment.time)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {appointment.reason}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
