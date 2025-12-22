import express from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, bookAppointment);
router.get('/patient', authMiddleware, getPatientAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.put('/:appointmentId/cancel', authMiddleware, cancelAppointment);

export default router;
