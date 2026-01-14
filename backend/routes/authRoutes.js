import express from 'express';
import {
  register,
  verifyOTP,
  login,
  resendOTP,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/otp-verification', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);

export default router;
