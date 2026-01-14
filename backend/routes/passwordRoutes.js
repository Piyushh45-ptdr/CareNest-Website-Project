import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/passwordController.js';

const router = express.Router();

/**
 * POST /api/password/forgot-password
 * Send password reset email
 * @access Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * POST /api/password/reset-password
 * Reset password with token
 * @access Public
 */
router.post('/reset-password', resetPassword);

/**
 * POST /api/password/change-password
 * Change password for logged-in user
 * @access Protected
 */
router.post('/change-password', authMiddleware, changePassword);

export default router;
