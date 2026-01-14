import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, AlertCircle, Users, Search, Mail, Calendar } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import adminService from "../services/adminService";

const ManagePatients = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchPatients();
  }, [user.role, navigate]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllPatients();
      setPatients(data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading patients...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Patients</h1>
            <p className="text-gray-600">View all registered patients in the system</p>
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

          {/* Search Bar */}
          <Card className="mb-6 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-lg border-gray-300"
              />
            </div>
          </Card>

          {/* Patients Table */}
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient, index) => (
                        <motion.tr
                          key={patient._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {patient.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                patient.isVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {patient.isVerified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(patient.createdAt).toLocaleDateString()}
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
                {searchTerm ? "No patients found" : "No patients registered"}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "There are no patients in the system yet"}
              </p>
            </Card>
          )}

          {/* Summary Statistics */}
          {patients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="p-6">
                <p className="text-gray-600 text-sm mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
              </Card>

              <Card className="p-6">
                <p className="text-gray-600 text-sm mb-1">Verified Patients</p>
                <p className="text-3xl font-bold text-green-600">
                  {patients.filter((p) => p.isVerified).length}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-gray-600 text-sm mb-1">Pending Verification</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {patients.filter((p) => !p.isVerified).length}
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManagePatients;
