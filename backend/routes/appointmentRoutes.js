import express from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
  getAppointmentById,
  getPrescription,
  updateAppointmentStatus,
  addPrescription,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create appointment
router.post('/', authMiddleware, bookAppointment);

// Get appointments
router.get('/patient', authMiddleware, getPatientAppointments);

// Get doctor's own appointments (authenticated)
router.get('/doctor', authMiddleware, getDoctorAppointments);

// Get appointments by specific doctor ID (public)
router.get('/doctor/:doctorId', getDoctorAppointments);

// Get single appointment
router.get('/:appointmentId', authMiddleware, getAppointmentById);

// Get prescription
router.get('/:appointmentId/prescription', authMiddleware, getPrescription);

// Update appointment status
router.put('/:appointmentId/status', authMiddleware, updateAppointmentStatus);

// Add prescription
router.post('/:appointmentId/prescription', authMiddleware, addPrescription);

// Cancel appointment
router.put('/:appointmentId/cancel', authMiddleware, cancelAppointment);

export default router;
