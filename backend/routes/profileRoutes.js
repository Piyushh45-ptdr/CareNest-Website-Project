import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  addMedicalHistory,
} from '../controllers/profileController.js';

const router = express.Router();

/**
 * GET /api/profile/:userId
 * Get user profile by userId
 * @access Protected
 */
router.get('/:userId', authMiddleware, getProfile);

/**
 * PUT /api/profile/:userId
 * Update user profile
 * @access Protected
 */
router.put('/:userId', authMiddleware, updateProfile);

/**
 * POST /api/profile/:userId/medical-history
 * Add medical history to user profile
 * @access Protected
 */
router.post('/:userId/medical-history', authMiddleware, addMedicalHistory);

export default router;
