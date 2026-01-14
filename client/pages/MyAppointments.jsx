import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Search, Eye, Archive } from "lucide-react";
import appointmentService from "../services/appointmentService";
import { motion } from "framer-motion";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    if (!token || user?.role !== "patient") {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [token, user, navigate]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, filterType]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getPatientAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (filterType === "upcoming") {
      filtered = filtered.filter(
        (apt) => new Date(apt.date) > new Date() && apt.status !== "cancelled"
      );
    } else if (filterType === "past") {
      filtered = filtered.filter((apt) => new Date(apt.date) < new Date());
    } else if (filterType === "cancelled") {
      filtered = filtered.filter((apt) => apt.status === "cancelled");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.doctorSpecialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this appointment? This action cannot be undone."
      )
    ) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        fetchAppointments();
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
      }
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

  const isUpcoming = (date, status) => {
    return new Date(date) > new Date() && status !== "cancelled";
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
            My Appointments
          </h1>
          <p className="text-gray-600">View and manage all your bookings</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by doctor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Appointments</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Appointments</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="text-right text-sm text-gray-600 pt-2">
                Found {filteredAppointments.length} appointment(s)
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appointments Grid */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Loading your appointments...</p>
          </Card>
        ) : filteredAppointments.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No appointments found</p>
            <Button
              onClick={() => navigate("/doctors")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Book an Appointment
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={`h-full hover:shadow-lg transition-all overflow-hidden ${
                    !isUpcoming(appointment.date, appointment.status)
                      ? "opacity-75"
                      : ""
                  }`}
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Doctor
                        </p>
                        <p className="font-bold text-gray-900">
                          Dr. {appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctorSpecialization}
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

                    {/* Details */}
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(appointment.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="text-sm">
                          {formatTime(appointment.time)}
                        </span>
                      </div>

                      {appointment.location && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {appointment.location}
                          </span>
                        </div>
                      )}

                      <div className="bg-gray-50 p-3 rounded-lg mt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Reason for Visit
                        </p>
                        <p className="text-sm text-gray-900">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => navigate(`/appointment/${appointment._id}`)}
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>

                      {isUpcoming(appointment.date, appointment.status) && (
                        <Button
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                          variant="outline"
                          className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyAppointments;
