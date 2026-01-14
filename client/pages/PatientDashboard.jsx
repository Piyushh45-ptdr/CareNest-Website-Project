/**
 * CareNest - PatientDashboard Component
 * Displays patient dashboard with upcoming appointments, medical history, and quick actions
 * Role: Patient only
 * Route: /patient-dashboard (protected)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Heart,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import appointmentService from "../services/appointmentService";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  });

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!token || user?.role !== "patient") {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [token, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getPatientAppointments();
      const allAppointments = response.data || response || [];

      // Calculate statistics
      const today = new Date();
      const upcomingAppts = allAppointments.filter(
        (apt) =>
          new Date(apt.date) >= today && apt.status !== "cancelled"
      );
      const completedAppts = allAppointments.filter(
        (apt) => apt.status === "completed"
      );

      setAppointments(allAppointments);
      setStats({
        totalAppointments: allAppointments.length,
        upcomingAppointments: upcomingAppts.length,
        completedAppointments: completedAppts.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Get upcoming appointments (next 5)
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading your dashboard...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "Patient"}!
          </h1>
          <p className="text-gray-600">
            Manage your appointments and medical information
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Appointments */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalAppointments}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-100" />
            </div>
          </Card>

          {/* Completed Appointments */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.completedAppointments}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-purple-100" />
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Button
            onClick={() => navigate("/doctors")}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Book New Appointment
          </Button>
          <Button
            onClick={() => navigate("/my-appointments")}
            variant="outline"
            className="h-12 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            View All Appointments
          </Button>
        </motion.div>

        {/* Upcoming Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upcoming Appointments
          </h2>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/appointment/${appointment._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.doctorId?.name || "Dr. Unknown"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {appointment.doctorId?.specialization ||
                            "Specialization not available"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600 mt-3">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                You have no upcoming appointments
              </p>
              <Button
                onClick={() => navigate("/doctors")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Book an Appointment Now
              </Button>
            </Card>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
