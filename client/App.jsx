import "./global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import all pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OtpVerification from "./pages/OtpVerification";
import NotFound from "./pages/NotFound";

// Authentication Pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// User Profile Pages
import Profile from "./pages/Profile";
import DoctorProfile from "./pages/DoctorProfile";

// Appointment Pages
import MyAppointments from "./pages/MyAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import DoctorDashboard from "./pages/DoctorDashboard";

// Admin Pages
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";

// Static Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Router>
          <Layout>
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}

              {/* Home & Doctor Discovery */}
              <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />   
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* ==================== PATIENT ROUTES ==================== */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/my-appointments" element={<ProtectedRoute element={<MyAppointments />} />} />
            <Route path="/appointment/:appointmentId" element={<ProtectedRoute element={<AppointmentDetails />} />} />
            <Route path="/book-appointment/:doctorId" element={<ProtectedRoute element={<BookAppointment />} />} />
            <Route path="/patient-dashboard" element={<ProtectedRoute element={<PatientDashboard />} />} />

            {/* ==================== DOCTOR ROUTES ==================== */}
            <Route path="/doctor-profile" element={<ProtectedRoute element={<DoctorProfile />} requiredRole="doctor" />} />
            <Route path="/doctor/dashboard" element={<ProtectedRoute element={<DoctorDashboard />} requiredRole="doctor" />} />
            <Route path="/doctor/appointments" element={<ProtectedRoute element={<DoctorAppointments />} requiredRole="doctor" />} />

            {/* ==================== ADMIN ROUTES ==================== */}
            <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
            <Route path="/admin/doctors" element={<ProtectedRoute element={<ManageDoctors />} requiredRole="admin" />} />
            <Route path="/admin/patients" element={<ProtectedRoute element={<ManagePatients />} requiredRole="admin" />} />

            {/* ==================== 404 ERROR ==================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        </Router> 
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
