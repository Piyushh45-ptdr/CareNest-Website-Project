import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Loader, Save, Briefcase, DollarSign, Award } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import profileService from "../services/profileService";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    qualifications: "",
    bio: "",
    availableTime: "",
  });

  useEffect(() => {
    if (user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchDoctorProfile();
  }, [user.role, navigate]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile(user._id);
      if (data.data) {
        setFormData({
          specialization: data.data.specialization || "",
          experience: data.data.experience || "",
          consultationFee: data.data.consultationFee || "",
          qualifications: Array.isArray(data.data.qualifications)
            ? data.data.qualifications.join(", ")
            : "",
          bio: data.data.bio || "",
          availableTime: data.data.availableTime || "",
        });
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.specialization || !formData.experience || !formData.consultationFee) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setUpdating(true);
      const updateData = {
        ...formData,
        qualifications: formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter((q) => q),
      };
      await profileService.updateProfile(user._id, updateData);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading your profile...</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Profile</h1>
            <p className="text-gray-600">Manage your professional information and consultation details</p>
          </motion.div>

          {/* Alert Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
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

          {/* Main Card */}
          <Card className="p-8">
            {/* User Basic Info */}
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Professional Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Professional Details
              </h2>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={updating}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="General Practitioner">General Practitioner</option>
                  <option value="Dental">Dental</option>
                </select>
              </div>

              {/* Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={updating}
                    min="0"
                    max="70"
                    className="h-11 rounded-lg border-gray-300"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Consultation Fee <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    disabled={updating}
                    min="0"
                    className="h-11 rounded-lg border-gray-300"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Qualifications
                </label>
                <textarea
                  placeholder="e.g., MBBS, MD, DM (comma-separated)"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  disabled={updating}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Enter qualifications separated by commas</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                <textarea
                  placeholder="Write a brief bio about yourself..."
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={updating}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Available Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Consultation Time</label>
                <Input
                  type="text"
                  placeholder="e.g., Monday-Friday, 10 AM - 6 PM"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleChange}
                  disabled={updating}
                  className="h-11 rounded-lg border-gray-300"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={updating}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <p>
              <strong>Note:</strong> Your profile information will be displayed to patients. Make sure all details are accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
