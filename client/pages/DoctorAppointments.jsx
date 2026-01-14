import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Search, CheckCircle, X, Plus } from "lucide-react";
import appointmentService from "../services/appointmentService";
import { motion } from "framer-motion";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
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
    fetchAppointments();
  }, [token, user, navigate]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getDoctorAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleMarkComplete = async (appointmentId) => {
    try {
      await appointmentService.updateAppointmentStatus(
        appointmentId,
        "completed"
      );
      fetchAppointments();
    } catch (error) {
      console.error("Failed to mark appointment as complete:", error);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.updateAppointmentStatus(
          appointmentId,
          "cancelled"
        );
        fetchAppointments();
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
      }
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleAddMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [
        ...prescriptionData.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };

  const handleRemoveMedicine = (index) => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: prescriptionData.medicines.filter((_, i) => i !== index),
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const medicines = [...prescriptionData.medicines];
    medicines[index] = { ...medicines[index], [field]: value };
    setPrescriptionData({ ...prescriptionData, medicines });
  };

  const handleSubmitPrescription = async () => {
    try {
      await appointmentService.addPrescription(
        selectedAppointment._id,
        prescriptionData
      );
      setShowPrescriptionModal(false);
      setPrescriptionData({
        medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
        notes: "",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to add prescription:", error);
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
            My Appointments
          </h1>
          <p className="text-gray-600">Manage and track all your appointments</p>
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
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="text-right text-sm text-gray-600 pt-2">
                Found {filteredAppointments.length} appointment(s)
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500">Loading appointments...</p>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Patient
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.patientEmail}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Date & Time
                        </p>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.time)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Reason
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {appointment.reason}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                        <div className="flex gap-2 mt-4">
                          {appointment.status !== "completed" &&
                            appointment.status !== "cancelled" && (
                              <>
                                <Button
                                  onClick={() => handleMarkComplete(appointment._id)}
                                  variant="outline"
                                  className="text-xs h-8 border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  onClick={() => handleCancel(appointment._id)}
                                  variant="outline"
                                  className="text-xs h-8 border-red-600 text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          <Button
                            onClick={() => handleAddPrescription(appointment)}
                            variant="outline"
                            className="text-xs h-8 border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Prescription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Prescription Modal */}
      <Dialog open={showPrescriptionModal} onOpenChange={setShowPrescriptionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Prescription</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAppointment && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Patient:</p>
                <p className="font-semibold text-gray-900">
                  {selectedAppointment.patientName}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Medicines
              </label>
              <div className="space-y-3">
                {prescriptionData.medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 items-end p-3 border border-gray-300 rounded-lg"
                  >
                    <Input
                      placeholder="Medicine name"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      className="text-sm"
                    />
                    <Input
                      placeholder="Dosage (e.g., 500mg)"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      className="text-sm"
                    />
                    <Input
                      placeholder="Frequency (e.g., 2x daily)"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Duration (days)"
                        type="number"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        className="text-sm"
                      />
                      {prescriptionData.medicines.length > 1 && (
                        <Button
                          onClick={() => handleRemoveMedicine(index)}
                          variant="outline"
                          className="h-10 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleAddMedicine}
                variant="outline"
                className="mt-3 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Medicine
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Notes
              </label>
              <Textarea
                placeholder="Any additional medical advice or notes for the patient..."
                value={prescriptionData.notes}
                onChange={(e) =>
                  setPrescriptionData({
                    ...prescriptionData,
                    notes: e.target.value,
                  })
                }
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowPrescriptionModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitPrescription}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DoctorAppointments;
