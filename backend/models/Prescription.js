import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
  },
  frequency: {
    type: String,
    enum: ['Once daily', 'Twice daily', 'Thrice daily', 'As needed'],
    required: [true, 'Frequency is required'],
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
});

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Appointment ID is required'],
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required'],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required'],
  },
  medicines: [medicineSchema],
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
  },
  instructions: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
prescriptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Prescription', prescriptionSchema);
