import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Phone, MapPin, Heart, Loader, Save, Plus, X } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import profileService from "../services/profileService";
import { authService } from "../services/authService";

const Profile = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHistory, setNewHistory] = useState({ condition: "", notes: "" });

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated() || !user) {
      navigate("/login", { replace: true });
      return;
    }

    fetchProfile();
  }, [navigate, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!user?._id) {
        throw new Error("User ID not found");
      }

      const data = await profileService.getProfile(user._id);
      setProfile(data.data);
      setFormData({
        dateOfBirth: data.data.dateOfBirth ? data.data.dateOfBirth.split("T")[0] : "",
        gender: data.data.gender || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?._id) {
      setError("User ID not found");
      return;
    }

    try {
      setUpdating(true);
      await profileService.updateProfile(user._id, formData);
      setSuccess("Profile updated successfully!");
      await fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error("Update profile error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddHistory = async (e) => {
    e.preventDefault();
    setError("");

    if (!newHistory.condition.trim()) {
      setError("Please enter a condition");
      return;
    }

    if (!user?._id) {
      setError("User ID not found");
      return;
    }

    try {
      setUpdating(true);
      await profileService.addMedicalHistory(user._id, newHistory);
      setSuccess("Medical history added successfully!");
      setNewHistory({ condition: "", notes: "" });
      setShowAddHistory(false);
      await fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add medical history");
      console.error("Add history error:", err);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your health information and medical history</p>
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

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border-b">
              <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Personal Details
              </TabsTrigger>
              <TabsTrigger value="medical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Medical History
              </TabsTrigger>
            </TabsList>

            {/* Personal Details Tab */}
            <TabsContent value="personal" className="mt-6">
              <Card className="p-8">
                {/* User Info Section */}
                <div className="mb-8 pb-8 border-b">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
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

                {/* Edit Form */}
                <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      disabled={updating}
                      className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      disabled={updating}
                      className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      disabled={updating}
                      className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }));
                        setError("");
                      }}
                      disabled={updating}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Submit Button */}
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
                </form>
              </Card>
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical" className="mt-6">
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Medical History</h2>
                  <Button
                    onClick={() => setShowAddHistory(!showAddHistory)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>

                {/* Add New History Form */}
                {showAddHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <form onSubmit={handleAddHistory} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medical Condition
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Diabetes, Hypertension"
                          value={newHistory.condition}
                          onChange={(e) =>
                            setNewHistory((prev) => ({
                              ...prev,
                              condition: e.target.value,
                            }))
                          }
                          disabled={updating}
                          className="h-11 rounded-lg border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Add any additional notes..."
                          value={newHistory.notes}
                          onChange={(e) =>
                            setNewHistory((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          disabled={updating}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={updating}
                          className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          {updating ? <Loader className="w-4 h-4 animate-spin" /> : "Add"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowAddHistory(false)}
                          variant="outline"
                          className="flex-1 h-10 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Medical History List */}
                {profile?.medicalHistory && profile.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {profile.medicalHistory.map((history, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3 flex-1">
                            <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{history.condition}</h3>
                              {history.notes && (
                                <p className="text-sm text-gray-600 mb-2">{history.notes}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                {new Date(history.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No medical history yet</p>
                    <p className="text-gray-400 text-sm">Add your medical conditions to keep track of your health</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
