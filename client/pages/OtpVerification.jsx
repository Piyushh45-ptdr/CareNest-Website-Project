import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader } from "lucide-react";
import { authService } from "../services/authService";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const registrationEmail = localStorage.getItem("registrationEmail");
    if (!registrationEmail) {
      navigate("/signup");
    } else {
      setEmail(registrationEmail);
      setTimer(60);
    }
  }, [navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    } else if (timer === 0 && email) {
      setCanResend(true);
    }
  }, [timer, email]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value.slice(0, 6));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOTP(email, otp);
      setSuccess("Email verified successfully! Redirecting to login...");
      
      localStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationRole");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setCanResend(false);
    setTimer(60);

    try {
      await authService.resendOTP(email);
      setSuccess("OTP resent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent flex items-center">
      <div className="container">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-center text-gray-600 mb-8">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-6">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-primary font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-600 text-sm">
                  Resend OTP in <span className="font-semibold text-primary">{timer}s</span>
                </p>
              )}
            </div>

            {/* Back to Signup */}
            <p className="text-center text-gray-600 mt-4 text-sm">
              <button
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                Back to Sign Up
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
