import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <div className="hidden md:block">
              <p className="font-bold text-lg text-blue-600">CareNest</p>
              <p className="text-xs text-gray-600">Your Health, Our Priority</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link
              to="/doctors"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Find Doctors
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <User className="w-4 h-4 text-gray-700" />
                    <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* Patient Menu */}
                    {user.role === "patient" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-appointments" className="cursor-pointer">
                            📅 My Appointments
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/patient-dashboard" className="cursor-pointer">
                            📊 Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Doctor Menu */}
                    {user.role === "doctor" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor-profile" className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/appointments" className="cursor-pointer">
                            📅 My Appointments
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/dashboard" className="cursor-pointer">
                            📊 Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Admin Menu */}
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin-dashboard" className="cursor-pointer">
                            📊 Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/doctors" className="cursor-pointer">
                            👨‍⚕️ Manage Doctors
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/patients" className="cursor-pointer">
                            👥 Manage Patients
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        ⚙️ Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Find Doctors
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <div className="border-t pt-4 mt-4">
              {token && user ? (
                <>
                  <p className="text-sm text-gray-700 font-semibold mb-3">
                    Welcome, {user.name}
                  </p>

                  {/* Patient Mobile Links */}
                  {user.role === "patient" && (
                    <>
                      <Link
                        to="/profile"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📝 My Profile
                      </Link>
                      <Link
                        to="/my-appointments"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📅 My Appointments
                      </Link>
                      <Link
                        to="/patient-dashboard"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                    </>
                  )}

                  {/* Doctor Mobile Links */}
                  {user.role === "doctor" && (
                    <>
                      <Link
                        to="/doctor-profile"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        👨‍⚕️ My Profile
                      </Link>
                      <Link
                        to="/doctor/appointments"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📅 My Appointments
                      </Link>
                      <Link
                        to="/doctor/dashboard"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                    </>
                  )}

                  {/* Admin Mobile Links */}
                  {user.role === "admin" && (
                    <>
                      <Link
                        to="/admin-dashboard"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        📊 Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/doctors"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        👨‍⚕️ Manage Doctors
                      </Link>
                      <Link
                        to="/admin/patients"
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        👥 Manage Patients
                      </Link>
                    </>
                  )}

                  <div className="border-t my-3"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-red-600 hover:text-red-700 font-medium text-left flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-blue-600 hover:text-blue-700 font-medium mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
