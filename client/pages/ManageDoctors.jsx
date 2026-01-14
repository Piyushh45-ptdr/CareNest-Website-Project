import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Trash2, AlertCircle, Users, Search } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import adminService from "../services/adminService";

const ManageDoctors = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchDoctors();
  }, [user.role, navigate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDoctors();
      setDoctors(data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      setDeleting(doctorId);
      await adminService.deleteDoctor(doctorId);
      setSuccess("Doctor deleted successfully!");
      setShowDeleteConfirm(null);
      await fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete doctor");
    } finally {
      setDeleting(null);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading doctors...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Doctors</h1>
            <p className="text-gray-600">View and manage all registered doctors</p>
          </motion.div>

          {/* Alert Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
            >
              {success}
            </motion.div>
          )}

          {/* Search Bar */}
          <Card className="mb-6 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-lg border-gray-300"
              />
            </div>
          </Card>

          {/* Doctors Table */}
          {filteredDoctors.length > 0 ? (
            <div className="overflow-x-auto">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Specialization</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Experience</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.map((doctor, index) => (
                        <motion.tr
                          key={doctor._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {doctor.userId?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doctor.userId?.email || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doctor.experience} years</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{doctor.consultationFee}</td>
                          <td className="px-6 py-4 text-sm">
                            {showDeleteConfirm === doctor._id ? (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleDelete(doctor._id)}
                                  disabled={deleting === doctor._id}
                                  className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                                >
                                  {deleting === doctor._id ? "Deleting..." : "Confirm"}
                                </Button>
                                <Button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  disabled={deleting === doctor._id}
                                  variant="outline"
                                  className="h-8 text-xs rounded"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setShowDeleteConfirm(doctor._id)}
                                variant="outline"
                                className="h-8 border-red-200 hover:bg-red-50 text-red-600 text-xs rounded"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No doctors found" : "No doctors registered"}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "There are no doctors in the system yet"}
              </p>
            </Card>
          )}

          {/* Summary */}
          {doctors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
            >
              <p>
                <strong>Total Doctors:</strong> {doctors.length} | <strong>Showing:</strong> {filteredDoctors.length}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageDoctors;
