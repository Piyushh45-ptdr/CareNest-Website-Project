import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
    enum: [
      'Cardiology',
      'Orthopedic',
      'Dermatology',
      'Pediatrics',
      'Psychiatry',
      'Neurology',
      'Gastroenterology',
      'Ophthalmology',
      'General Practitioner',
      'Dental',
    ],
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0,
    max: 70,
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please provide consultation fee'],
    default: 500,
  },
  qualifications: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  availableSlots: {
    type: [
      {
        day: String, // e.g., 'Monday'
        startTime: String, // e.g., '09:00'
        endTime: String, // e.g., '17:00'
      },
    ],
    default: [],
  },
  isAvailable: {
    type: Boolean,
    default: true,
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

doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Doctor', doctorSchema);
