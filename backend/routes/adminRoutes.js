import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

export default router;
