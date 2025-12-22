import Doctor from '../models/Doctor.js';

export const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;

    let filter = { isAvailable: true };

    if (specialization) {
      filter.specialization = specialization;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(filter)
      .select('-userId')
      .sort({ rating: -1 });

    res.status(200).json({
      message: 'Doctors retrieved successfully',
      data: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).select('-userId');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor retrieved successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
};

export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization');

    res.status(200).json({
      message: 'Specializations retrieved successfully',
      data: specializations,
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch specializations', error: error.message });
  }
};
