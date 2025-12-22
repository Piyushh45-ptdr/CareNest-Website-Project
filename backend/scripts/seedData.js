import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carenest");
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Create sample doctors with users
    const doctorsData = [
      {
        name: "Dr. Rajesh Kumar",
        specialization: "Cardiology",
        experience: 12,
        consultationFee: 500,
      },
      {
        name: "Dr. Priya Singh",
        specialization: "Dermatology",
        experience: 8,
        consultationFee: 400,
      },
      {
        name: "Dr. Amit Patel",
        specialization: "Orthopedic",
        experience: 15,
        consultationFee: 600,
      },
      {
        name: "Dr. Neha Sharma",
        specialization: "Pediatrics",
        experience: 10,
        consultationFee: 350,
      },
      {
        name: "Dr. Suresh Verma",
        specialization: "Neurology",
        experience: 18,
        consultationFee: 700,
      },
      {
        name: "Dr. Anjali Gupta",
        specialization: "General Practitioner",
        experience: 6,
        consultationFee: 300,
      },
      {
        name: "Dr. Vikram Singh",
        specialization: "Gastroenterology",
        experience: 14,
        consultationFee: 550,
      },
      {
        name: "Dr. Maya Reddy",
        specialization: "Ophthalmology",
        experience: 11,
        consultationFee: 450,
      },
      {
        name: "Dr. Arjun Desai",
        specialization: "Psychiatry",
        experience: 9,
        consultationFee: 420,
      },
      {
        name: "Dr. Ravi Kumar",
        specialization: "Dental",
        experience: 7,
        consultationFee: 380,
      },
    ];

    const createdDoctors = [];

    for (const doctorData of doctorsData) {
      // Create user for doctor
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        name: doctorData.name,
        email: `${doctorData.name.toLowerCase().replace(/\s+/g, ".")}@carenest.com`,
        password: hashedPassword,
        role: "doctor",
        isVerified: true,
      });
      await user.save();

      // Create doctor profile
      const doctor = new Doctor({
        userId: user._id,
        name: doctorData.name,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        consultationFee: doctorData.consultationFee,
        rating: (Math.random() * 1 + 4).toFixed(1),
        reviewCount: Math.floor(Math.random() * 200 + 10),
        qualifications: ["MBBS", "MD", "Board Certified"],
        bio: `Experienced ${doctorData.specialization} specialist with ${doctorData.experience} years of practice.`,
        availableSlots: [
          { day: "Monday", startTime: "09:00", endTime: "17:00" },
          { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
          { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
          { day: "Thursday", startTime: "09:00", endTime: "17:00" },
          { day: "Friday", startTime: "09:00", endTime: "17:00" },
          { day: "Saturday", startTime: "10:00", endTime: "14:00" },
        ],
        isAvailable: true,
      });
      await doctor.save();
      createdDoctors.push(doctor);
    }

    // Create sample admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin",
      email: "admin@carenest.com",
      password: adminPassword,
      role: "admin",
      isVerified: true,
    });
    await adminUser.save();

    // Create sample patient user
    const patientPassword = await bcrypt.hash("patient123", 10);
    const patientUser = new User({
      name: "John Patient",
      email: "patient@carenest.com",
      password: patientPassword,
      role: "patient",
      isVerified: true,
    });
    await patientUser.save();

    console.log(`✅ Database seeded successfully!`);
    console.log(`📝 Created ${createdDoctors.length} doctors`);
    console.log(`👤 Created 1 admin user (admin@carenest.com / admin123)`);
    console.log(`🧑‍⚕️ Created 1 patient user (patient@carenest.com / patient123)`);
    console.log("\nTest Credentials:");
    console.log("Admin: admin@carenest.com / admin123");
    console.log("Patient: patient@carenest.com / patient123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
