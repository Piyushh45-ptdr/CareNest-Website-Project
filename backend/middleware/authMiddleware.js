import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};

export const doctorMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};
