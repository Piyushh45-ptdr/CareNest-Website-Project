import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";

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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <div className="hidden md:block">
              <p className="font-bold text-lg text-primary">CareNest</p>
              <p className="text-xs text-gray-600">Your Health, Our Priority</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link
              to="/doctors"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Find Doctors
            </Link>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                {user.role === "admin" ? (
                  <Link to="/admin-dashboard" className="btn-primary text-sm">
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/patient-dashboard" className="btn-primary text-sm">
                    My Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-outline text-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
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
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Find Doctors
            </Link>
            <a href="#services" className="block py-2 text-gray-700 hover:text-primary">
              Services
            </a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-primary">
              About
            </a>

            <div className="border-t pt-4 mt-4">
              {token && user ? (
                <>
                  <p className="text-sm text-gray-700 mb-2">Welcome, {user.name}</p>
                  {user.role === "admin" ? (
                    <Link
                      to="/admin-dashboard"
                      className="block btn-primary text-center mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/patient-dashboard"
                      className="block btn-primary text-center mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block btn-outline text-center mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block btn-primary text-center"
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
