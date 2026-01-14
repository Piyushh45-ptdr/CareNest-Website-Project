/**
 * CareNest - AdminDashboard Component
 * Displays admin dashboard with user management, doctor management, and system statistics
 * Role: Admin only
 * Route: /admin-dashboard (protected)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  Trash2,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import adminService from "../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
  });

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [token, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersRes, doctorsRes, patientsRes] = await Promise.all([
        adminService.getAllUsers().catch(() => ({ data: [] })),
        adminService.getAllDoctors().catch(() => ({ data: [] })),
        adminService.getAllPatients().catch(() => ({ data: [] })),
      ]);

      const allUsers = usersRes.data || usersRes || [];
      const allDoctors = doctorsRes.data || doctorsRes || [];
      const allPatients = patientsRes.data || patientsRes || [];

      setUsers(allUsers);
      setDoctors(allDoctors);
      setStats({
        totalUsers: allUsers.length,
        totalDoctors: allDoctors.length,
        totalAppointments: 0, // Would be calculated from appointments
        totalPatients: allPatients.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await adminService.deleteDoctor(doctorId);
        setDoctors(doctors.filter((d) => d._id !== doctorId));
        setStats((prev) => ({
          ...prev,
          totalDoctors: prev.totalDoctors - 1,
        }));
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading admin dashboard...</p>
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, doctors, and system statistics
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Users */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          {/* Total Doctors */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalDoctors}
                </p>
              </div>
              <Stethoscope className="w-12 h-12 text-green-100" />
            </div>
          </Card>

          {/* Total Patients */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalPatients}
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-100" />
            </div>
          </Card>

          {/* Total Appointments */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Appointments</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.totalAppointments}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-orange-100" />
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "doctors"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Doctors ({doctors.length})
            </button>
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  System Overview
                </h3>
                <p className="text-gray-600 mb-4">
                  Your CareNest system is running smoothly with {stats.totalUsers} total users,
                  including {stats.totalDoctors} doctors and {stats.totalPatients} patients.
                </p>
                <p className="text-sm text-gray-500">
                  Manage users and doctors using the tabs above
                </p>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((u, index) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {u.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{u.email}</p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                  u.role
                                )}`}
                              >
                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                              </span>
                              {u.isVerified && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Verified
                                </span>
                              )}
                              {!u.isVerified && (
                                <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                                  <AlertCircle className="w-4 h-4" />
                                  Pending Verification
                                </span>
                              )}
                            </div>
                          </div>
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No users found</p>
                </Card>
              )}
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === "doctors" && (
            <div>
              {doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.map((doctor, index) => (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Dr. {doctor.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {doctor.specialization}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Email: {doctor.email}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              {doctor.experience && (
                                <span className="text-gray-700">
                                  <strong>Experience:</strong> {doctor.experience} years
                                </span>
                              )}
                              {doctor.consultationFee && (
                                <span className="text-gray-700">
                                  <strong>Fee:</strong> ₹{doctor.consultationFee}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteDoctor(doctor._id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No doctors found</p>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

