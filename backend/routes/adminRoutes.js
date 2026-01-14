import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users (patients)
 * @access Protected (Admin only)
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Get Users Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

/**
 * GET /api/admin/doctors
 * Get all doctors
 * @access Protected (Admin only)
 */
router.get('/doctors', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Doctors retrieved successfully',
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Get Doctors Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

/**
 * DELETE /api/admin/doctors/:doctorId
 * Delete a doctor by ID
 * @access Protected (Admin only)
 */
router.delete('/doctors/:doctorId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Validate doctorId
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    // Find and delete doctor
    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete associated user account if exists
    if (doctor.userId) {
      await User.findByIdAndDelete(doctor.userId);
    }

    console.log(`✅ Doctor deleted: ${doctorId}`);

    res.status(200).json({
      message: 'Doctor deleted successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Delete Doctor Error:', error.message);
    res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
  }
});

/**
 * GET /api/admin/patients
 * Get all patients (alias for users)
 * @access Protected (Admin only)
 */
router.get('/patients', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Patients retrieved successfully',
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Get Patients Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
});

export default router;
