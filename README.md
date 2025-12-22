# CareNest - Doctor Appointment Booking Platform

> **Your Health, Our Priority**

A complete MERN stack web application for booking doctor appointments online. Built with React + Vite (frontend) and Node.js + Express (backend).

## 🚀 Features

- 👨‍⚕️ **Browse Doctors** - Find and filter doctors by specialization
- 📅 **Book Appointments** - Easy appointment scheduling
- 🔐 **Secure Authentication** - Email OTP verification and JWT tokens
- 👤 **User Profiles** - Separate dashboards for patients and doctors
- 💻 **Admin Panel** - Manage users and appointments
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Beautiful, smooth animations with Framer Motion

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion (Animations)
- Axios (API calls)
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB (Community Server)
- Mongoose ODM
- JWT Authentication
- Nodemailer (OTP)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Community Server (running on localhost:27017)
- Gmail account (for OTP emails) - with [App Password](https://myaccount.google.com/apppasswords)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

#### Backend Setup

Create a `.env` file in the `backend` directory:

```env
PORT=6400
MONGO_URI=mongodb://127.0.0.1:27017/carenest

# JWT
JWT_SECRET=your_secret_key_change_this_in_production

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# CORS
FRONTEND_URL=http://localhost:5173
```

**How to get Gmail App Password:**
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Select "Security" from left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Under "App passwords", select Mail and Windows (or your device)
5. Copy the generated app password and paste in `.env`

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# On Linux/Mac
mongod

# On Windows
mongod.exe
```

### 4. Seed Sample Data (Optional)

Populate the database with sample doctors:

```bash
cd backend
npx node scripts/seedData.js
cd ..
```

**Test Credentials:**
- Admin: `admin@carenest.com` / `admin123`
- Patient: `patient@carenest.com` / `patient123`

### 5. Start the Application

#### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:6400`

#### Start Frontend (Terminal 2)

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
carenest/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Doctor.js            # Doctor schema
│   │   └── Appointment.js       # Appointment schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── doctorController.js  # Doctor logic
│   │   └── appointmentController.js  # Appointment logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── mail.js              # Email/OTP utilities
│   ├── scripts/
│   │   └── seedData.js          # Database seeding
│   ├── server.js                # Express server
│   └── package.json
│
├── client/
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── DoctorsList.jsx
│   │   ├── DoctorDetails.jsx
│   │   ├── BookAppointment.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── OtpVerification.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js               # Axios instance
│   │   ├── authService.js
│   │   ├── doctorService.js
│   │   └── appointmentService.js
│   ├── App.jsx
│   └── global.css
│
├── index.html
├── tailwind.config.ts
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/login` - Login user
- `POST /api/auth/resend-otp` - Resend OTP

### Doctors
- `GET /api/doctors` - List all doctors (with filters)
- `GET /api/doctors/specializations` - Get specializations
- `GET /api/doctors/:id` - Get doctor details

### Appointments
- `POST /api/appointments` - Book appointment (requires auth)
- `GET /api/appointments/patient` - Get patient appointments (requires auth)
- `GET /api/appointments/doctor/:doctorId` - Get doctor appointments
- `PUT /api/appointments/:appointmentId/cancel` - Cancel appointment (requires auth)

### Admin
- `GET /api/admin/users` - Get all users (admin only)

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "patient" | "doctor" | "admin",
  isVerified: Boolean,
  otp: String,
  otpExpiry: Date,
  avatar: String,
  createdAt: Date
}
```

### Doctor
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  specialization: String,
  experience: Number,
  consultationFee: Number,
  qualifications: [String],
  bio: String,
  photo: String,
  rating: Number (0-5),
  reviewCount: Number,
  availableSlots: [{day, startTime, endTime}],
  isAvailable: Boolean,
  createdAt: Date
}
```

### Appointment
```javascript
{
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  date: Date,
  time: String,
  status: "booked" | "cancelled" | "completed",
  notes: String,
  consultationFee: Number,
  isPaid: Boolean,
  reason: String,
  cancellationReason: String,
  prescription: String,
  createdAt: Date
}
```

## 🚦 Running in Production

### Build Frontend
```bash
npm run build
```

### Production Backend
```bash
cd backend
npm start
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on port 27017
- Check `MONGO_URI` in `.env` is correct
- Try: `mongosh` to test connection

### Email OTP Not Sending
- Verify Gmail credentials in `.env`
- Use [App Password](https://myaccount.google.com/apppasswords), not regular password
- Enable "Less secure apps" if not using App Password
- Check spam folder

### CORS Errors
- Ensure backend is running on port 6400
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Verify backend has CORS middleware enabled

### Port Already in Use
```bash
# Kill process on port 6400 (backend)
lsof -i :6400 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📝 Authentication Flow

1. **Sign Up**: User enters name, email, password
2. **OTP Sent**: Email with 6-digit OTP sent via Nodemailer
3. **Verify OTP**: User enters OTP to verify email
4. **Login**: User logs in with email and password
5. **JWT Token**: Backend generates JWT token (7-day expiry)
6. **Protected Routes**: Token required for authenticated endpoints

## 🎨 Customization

### Change Primary Color
Edit `client/global.css`:
```css
--primary: 210 100% 50%; /* Change this */
```

### Change Brand Name
Search for "CareNest" in the codebase and replace with your brand name.

## 📄 License

MIT License - feel free to use this project for commercial and personal purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues, questions, or feedback:
- Create an issue in the repository
- Email: support@carenest.com

---

**Made with ❤️ for better healthcare** ✨
