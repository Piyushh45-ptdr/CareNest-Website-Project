import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Stethoscope, FileText, User } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import  Navbar  from "../components/common/Navbar";
import  Footer  from "../components/common/Footer";
import { useState, useEffect } from "react";
import { appointmentService } from "../services/appointmentService";

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
      if (data.prescriptionId) {
        // Fetch prescription if it exists
        const rxData = await appointmentService.getPrescription(data.prescriptionId);
        setPrescription(rxData);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
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
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-500">Loading appointment details...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Appointment not found</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Appointment Details
              </h1>
              <p className="text-gray-600">Booking ID: {appointment._id}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Appointment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Card */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Appointment Schedule
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(appointment.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Time
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTime(appointment.time)}
                  </p>
                </div>
              </div>
              {appointment.location && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Location
                  </p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Doctor Info Card */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-green-600" />
                Doctor Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    Dr. {appointment.doctorName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Specialization
                  </p>
                  <p className="text-gray-900">{appointment.doctorSpecialization}</p>
                </div>
                {appointment.doctorEmail && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      Email
                    </p>
                    <p className="text-gray-900">{appointment.doctorEmail}</p>
                  </div>
                )}
                {appointment.doctorPhone && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      Phone
                    </p>
                    <p className="text-gray-900">{appointment.doctorPhone}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Reason Card */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Appointment Reason
              </h2>
              <p className="text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {appointment.reason}
              </p>
            </Card>

            {/* Prescription Tab */}
            {prescription && (
              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Prescription
                </h2>
                <div className="space-y-4">
                  {prescription.medicines && prescription.medicines.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-3">
                        Medicines
                      </p>
                      <div className="space-y-2">
                        {prescription.medicines.map((medicine, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <p className="font-medium text-gray-900">
                              {medicine.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {medicine.dosage} • {medicine.frequency} • For{" "}
                              {medicine.duration} days
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {prescription.notes && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">
                        Doctor's Notes
                      </p>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Patient Info */}
          <div>
            <Card className="p-6 bg-white sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" />
                Patient Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Name
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {appointment.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Email
                  </p>
                  <p className="text-gray-900 break-all">
                    {appointment.patientEmail}
                  </p>
                </div>
                {appointment.patientPhone && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      Phone
                    </p>
                    <p className="text-gray-900">{appointment.patientPhone}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Booking Date
                  </p>
                  <p className="text-gray-900">
                    {formatDate(appointment.createdAt)}
                  </p>
                </div>
              </div>

              {appointment.status === "completed" && prescription && (
                <Button
                  onClick={() => window.print()}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  Print Prescription
                </Button>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentDetails;
