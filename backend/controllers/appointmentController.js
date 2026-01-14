import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Prescription from '../models/Prescription.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.userId;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date: new Date(date),
      time,
      reason,
      consultationFee: doctor.consultationFee,
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.userId;

    const appointments = await Appointment.find({ patientId })
      .populate({
        path: 'doctorId',
        select: 'name specialization photo consultationFee',
      })
      .sort({ date: -1 });

    res.status(200).json({
      message: 'Patient appointments retrieved',
      data: appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.userId;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own appointments' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    // If doctorId is in params, use that. Otherwise, use the logged-in user's ID
    const doctorId = req.params.doctorId || req.userId;

    const appointments = await Appointment.find({ doctorId })
      .populate({
        path: 'patientId',
        select: 'name email',
      })
      .sort({ date: -1 });

    res.status(200).json({
      message: 'Doctor appointments retrieved',
      data: appointments,
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      message: 'Failed to fetch doctor appointments',
      error: error.message,
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: 'doctorId',
        select: 'name specialization photo consultationFee',
      })
      .populate({
        path: 'patientId',
        select: 'name email',
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
};

// Get prescription for appointment
export const getPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await Prescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({
      message: 'Prescription retrieved successfully',
      data: prescription,
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Failed to fetch prescription', error: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const doctorId = req.userId;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'completed', 'cancelled', 'confirmed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only doctor or admin can update status
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'You can only update your own appointments' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: 'Appointment status updated successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

// Add prescription to appointment
export const addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { medicines, notes } = req.body;
    const doctorId = req.userId;

    if (!medicines || !Array.isArray(medicines)) {
      return res.status(400).json({ message: 'Medicines array is required' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the doctor can add prescription
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'You can only add prescriptions to your own appointments' });
    }

    // Create prescription
    const prescription = new Prescription({
      appointmentId,
      medicines,
      notes,
      issuedDate: new Date(),
    });

    await prescription.save();

    // Link prescription to appointment
    appointment.prescriptionId = prescription._id;
    await appointment.save();

    res.status(201).json({
      message: 'Prescription added successfully',
      data: prescription,
    });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ message: 'Failed to add prescription', error: error.message });
  }
};
