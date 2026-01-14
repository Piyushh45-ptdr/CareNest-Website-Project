import Profile from '../models/Profile.js';
import User from '../models/User.js';

/**
 * Get user profile
 * @route GET /api/profile/:userId
 * @access Protected
 */
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find profile
    let profile = await Profile.findOne({ userId }).populate('userId', 'name email avatar role');

    if (!profile) {
      // Create a new profile if it doesn't exist
      profile = new Profile({ userId });
      await profile.save();
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
  }
};

/**
 * Update user profile
 * @route PUT /api/profile/:userId
 * @access Protected
 */
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dateOfBirth, gender, phone, address, medicalHistory } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find existing profile or create new one
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({ userId });
    }

    // Update fields
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profile.gender = gender;
    if (phone !== undefined) profile.phone = phone;
    if (address !== undefined) profile.address = address;
    if (medicalHistory !== undefined) profile.medicalHistory = medicalHistory;

    // Validate phone number if provided
    if (phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Save profile
    const updatedProfile = await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

/**
 * Add medical history
 * @route POST /api/profile/:userId/medical-history
 * @access Protected
 */
export const addMedicalHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { condition, notes } = req.body;

    if (!condition) {
      return res.status(400).json({ message: 'Medical condition is required' });
    }

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({ userId });
    }

    profile.medicalHistory.push({
      condition,
      notes: notes || '',
      date: Date.now(),
    });

    const updatedProfile = await profile.save();

    res.status(201).json({
      message: 'Medical history added successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Add Medical History Error:', error.message);
    res.status(500).json({ message: 'Failed to add medical history', error: error.message });
  }
};
