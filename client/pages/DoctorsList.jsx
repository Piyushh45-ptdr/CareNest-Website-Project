import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Award, Clock, Star, Loader } from "lucide-react";
import { doctorService } from "../services/doctorService";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const [doctorsList, specs] = await Promise.all([
          doctorService.getDoctors(filters),
          doctorService.getSpecializations(),
        ]);
        setDoctors(doctorsList);
        setSpecializations(specs);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [filters]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Find <span className="text-gradient">Expert Doctors</span>
          </h1>
          <p className="text-xl text-gray-600">Browse our network of qualified healthcare professionals</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" />
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && (
          <>
            {doctors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-xl text-gray-600">No doctors found matching your criteria.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden card-shadow cursor-pointer transition-all"
                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                  >
                    {/* Doctor Card Header */}
                    <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
                      <div className="absolute -bottom-8 left-6">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center">
                          <Award className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Doctor Card Body */}
                    <div className="pt-12 px-6 pb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium mb-4">{doctor.specialization}</p>

                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary" />
                          <span>{doctor.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{doctor.rating} ({doctor.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Consultation Fee</p>
                          <p className="text-2xl font-bold text-primary">₹{doctor.consultationFee}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book-appointment/${doctor._id}`);
                          }}
                          className="btn-primary text-sm whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
