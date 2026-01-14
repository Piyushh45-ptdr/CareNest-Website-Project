# 🚀 CARENEST - Complete Deployment Guide

**Version:** 1.0  
**Last Updated:** December 27, 2025  
**Status:** Step-by-step deployment guide for production

---

## 📖 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Local Setup & Testing](#local-setup--testing)
4. [Security Hardening](#security-hardening)
5. [Deployment Platforms](#deployment-platforms)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Prerequisites

### Required Tools
```
1. Node.js (v18 or higher)
   Download: https://nodejs.org/
   Verify: node --version

2. npm or pnpm (comes with Node)
   Verify: npm --version or pnpm --version

3. MongoDB Atlas Account
   Signup: https://www.mongodb.com/cloud/atlas
   Create: Free cluster

4. Git
   Download: https://git-scm.com/

5. GitHub Account (for code hosting)
   Signup: https://github.com

6. Deployment Platform Account (choose one):
   - Vercel (for frontend)
   - Railway or Render (for backend)
   - Netlify (for frontend)
```

### Accounts & Services
```
✓ MongoDB Atlas account with cluster
✓ Email service account (Gmail, SendGrid, etc.)
✓ Deployment platform account
✓ Domain name (optional, can use provided domain)
✓ SSL certificate (usually auto-provided by platform)
```

---

## 📋 Pre-Deployment Checklist

### Code Quality Checks

```bash
# 1. Remove console logs (for production)
grep -r "console\." backend/ --include="*.js" | grep -v node_modules
# Remove all console logs or replace with logging service

# 2. Check for hardcoded values
grep -r "localhost" backend/ --include="*.js"
grep -r "mongodb+srv://" backend/ --include="*.js"
grep -r "jwt_secret_key" backend/ --include="*.js"
# Should return nothing - all should be in .env

# 3. Verify all imports are correct
npm run typecheck (if available)

# 4. Test all endpoints locally
npm test (if test suite exists)
```

### Security Checks

```bash
# 1. Check for .env in git history
git log --all --full-history -- ".env"
git log --all --full-history -- "backend/config/database.js"
# If found, must clean git history and reset credentials

# 2. Verify sensitive files are in .gitignore
cat .gitignore
# Should include: .env, .env.local, node_modules, dist, etc.

# 3. Check dependencies for vulnerabilities
npm audit
npm audit fix

# 4. Verify CORS is properly configured
# Should not have * for origin in production
```

### Configuration Checks

```
✓ All environment variables documented
✓ .env.example file created
✓ No hardcoded credentials anywhere
✓ JWT_SECRET is strong (use password generator)
✓ MONGO_URI uses correct database name
✓ FRONTEND_URL matches actual frontend URL
✓ EMAIL credentials verified and working
```

---

## 🔧 Local Setup & Testing

### Step 1: Install Dependencies

```bash
# Install root dependencies (if needed)
npm install
# or
pnpm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install

# Go back to root
cd ..
```

### Step 2: Configure Environment Variables

```bash
# Create backend/.env file
cat > backend/.env << EOF
# Server Configuration
PORT=6401
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carenest_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-very-long-random-secret-key-here-min-32-chars

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional
LOG_LEVEL=debug
EOF

# Create client/.env file
cat > client/.env << EOF
VITE_API_URL=http://localhost:6401/api
EOF
```

### Step 3: Test Backend

```bash
# Start backend server
cd backend
npm run dev

# Expected output:
# ✅ MongoDB connected successfully
# ✅ CareNest Backend running on http://localhost:6401
# 📡 CORS enabled for http://localhost:5173

# In another terminal, test health endpoint:
curl http://localhost:6401/api/health

# Should return:
# {"message":"CareNest Backend is running"}
```

### Step 4: Test Frontend

```bash
# In another terminal
cd client
npm run dev

# Expected output:
# VITE v7.1.2 ready in xxx ms
# ➜  Local:   http://localhost:5173/

# Open browser and visit http://localhost:5173
```

### Step 5: Test Key Flows

```
1. Registration Flow
   - Navigate to /signup
   - Enter test data
   - Should receive OTP email
   - Verify OTP
   - Should redirect to login

2. Login Flow
   - Navigate to /login
   - Enter credentials
   - Should receive token
   - Should redirect to dashboard

3. Doctor Search
   - Navigate to /doctors
   - Should load list of doctors
   - Can filter by specialization

4. Book Appointment
   - Click "Book Appointment" on doctor
   - Select date and time
   - Submit form
   - Should appear in "My Appointments"

5. Admin Panel
   - Login as admin
   - Navigate to /admin/dashboard
   - Should see management options
```

---

## 🔐 Security Hardening

### Step 1: Fix Critical Issues

```bash
# 1. Remove credentials from database.js
# File: backend/config/database.js
# Change from:
# const mongoURI = process.env.MONGO_URI || 'mongodb+srv://...password...@...';

# To:
# const mongoURI = process.env.MONGO_URI;
# if (!mongoURI) throw new Error('MONGO_URI not configured');
```

**Implementation:**
```javascript
// backend/config/database.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
```

### Step 2: Secure JWT Secret

```javascript
// backend/utils/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for production');
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

### Step 3: Add Input Validation

```bash
# Install validator package
npm install express-validator

# Or install joi
npm install joi
```

**Create:** `backend/middleware/validators.js`
```javascript
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};
```

**Use in routes:**
```javascript
// backend/routes/authRoutes.js
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validators.js';

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
```

### Step 4: Add Rate Limiting

```bash
npm install express-rate-limit
```

**Create:** `backend/middleware/rateLimiter.js`
```javascript
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.user, // Skip for authenticated users
});
```

**Use in server:**
```javascript
// backend/server.js
import { authLimiter, generalLimiter } from './middleware/rateLimiter.js';

app.use(generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/password/forgot-password', authLimiter);
```

### Step 5: Fix API Port in Frontend

```javascript
// client/services/api.js
import axios from "axios";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:6401/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ... rest of code
```

### Step 6: Fix Unprotected Routes

```javascript
// backend/routes/appointmentRoutes.js
import { authMiddleware } from '../middleware/authMiddleware.js';

// Change from:
// router.get('/doctor/:doctorId', getDoctorAppointments);

// To:
router.get('/doctor/:doctorId', authMiddleware, getDoctorAppointments);
```

### Step 7: Add Global Error Handler

**Create:** `backend/middleware/errorHandler.js`
```javascript
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  console.error(`[${status}] ${message}:`, err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(status).json({
      message: status === 500 ? 'Internal server error' : message,
    });
  } else {
    res.status(status).json({
      message,
      error: err.stack,
    });
  }
};
```

**Use in server:**
```javascript
// At the end of backend/server.js
app.use(errorHandler);
```

### Step 8: Install Security Headers

```bash
npm install helmet
```

**Use in server:**
```javascript
// backend/server.js
import helmet from 'helmet';

app.use(helmet());
```

---

## 🌐 Deployment Platforms

### Option 1: Deploy Backend on Railway ⭐ RECOMMENDED

**Advantages:**
- Easy MongoDB integration
- Environment variables management
- Automatic deployments from GitHub
- Generous free tier

**Steps:**

```bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 2. Push to GitHub
git remote add origin https://github.com/yourusername/carenest.git
git push -u origin main

# 3. On Railway.app:
# - Sign up with GitHub
# - Create new project
# - Connect GitHub repository
# - Select backend folder as root directory
# - Add MongoDB plugin
# - Configure environment variables
```

**Configure Environment Variables in Railway:**
```
PORT=6401
MONGO_URI=<provided by Railway MongoDB plugin>
JWT_SECRET=<generate strong secret>
FRONTEND_URL=<your frontend URL>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your email>
EMAIL_PASS=<your app password>
NODE_ENV=production
```

**Get Backend URL:** Railway will provide URL like `https://carenest-backend.up.railway.app`

### Option 2: Deploy Backend on Render

**Advantages:**
- Free tier available
- Easy to use
- Good documentation

**Steps:**

```bash
# 1. Create Render account at render.com
# 2. Create new Web Service
# 3. Connect GitHub repository
# 4. Configure:
Build Command: npm install
Start Command: node backend/server.js

# 5. Add Environment Variables (same as above)
# 6. Click Deploy
```

### Option 3: Deploy Frontend on Vercel ⭐ RECOMMENDED

**Advantages:**
- Best for React/Vite apps
- Automatic deployments
- Great performance
- Free tier

**Steps:**

```bash
# 1. Go to vercel.com
# 2. Import project from GitHub
# 3. Select frontend as root directory
# 4. Environment Variables:
VITE_API_URL=https://your-backend-url.com/api

# 5. Click Deploy
```

### Option 4: Deploy Frontend on Netlify

**Advantages:**
- Form handling
- Serverless functions
- Easy deployment

**Steps:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd client
npm run build

# Deploy
netlify deploy --prod

# Or connect GitHub:
# 1. Go to netlify.com
# 2. New site from Git
# 3. Select GitHub repository
# 4. Build command: npm run build (from client)
# 5. Publish directory: client/dist
```

---

## 📦 Full Production Deployment Steps

### Complete Deployment Workflow

```bash
# ===== BACKEND DEPLOYMENT =====

# 1. Ensure all security fixes are applied
# 2. Create .env.production in backend/
# 3. Push to GitHub

# For Railway:
# - Go to Railway dashboard
# - Trigger redeploy or wait for auto-deploy
# - Copy backend URL from Railway

# ===== FRONTEND DEPLOYMENT =====

# 1. Update frontend .env with backend URL
cat > client/.env.production << EOF
VITE_API_URL=https://your-backend-railway-url/api
EOF

# 2. Build frontend
cd client
npm run build

# 3. Test build locally
npm run preview

# 4. Deploy to Vercel
cd ..
vercel --prod

# Or for Netlify:
netlify deploy --prod --dir=client/dist
```

### Deployment on Own Server (Advanced)

If using your own VPS:

```bash
# 1. SSH into server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MongoDB (if self-hosted)
sudo apt-get install -y mongodb-server

# 4. Clone repository
git clone https://github.com/yourusername/carenest.git
cd carenest

# 5. Install dependencies
npm install
cd backend && npm install
cd ../client && npm install
cd ..

# 6. Create .env files
# ... configure environment variables

# 7. Install PM2 for process management
npm install -g pm2

# 8. Start backend with PM2
cd backend
pm2 start server.js --name "carenest-backend"
pm2 save
pm2 startup

# 9. Build and serve frontend
cd ../client
npm run build

# 10. Install and start nginx
sudo apt-get install nginx
# Configure nginx to serve client/dist

# 11. Set up SSL with Let's Encrypt
sudo certbot certonly --nginx -d yourdomain.com
```

---

## ✅ Post-Deployment

### Step 1: Verify Deployment

```bash
# Test health endpoint
curl https://your-backend-url/api/health

# Should return:
# {"message":"CareNest Backend is running"}

# Test frontend
# Open https://your-frontend-url in browser
# Should load without errors
```

### Step 2: Test End-to-End Flows

```
1. Create test account
   - Signup with test email
   - Verify OTP
   - Login

2. Search doctors
   - View doctor list
   - Filter by specialization
   - View doctor details

3. Book appointment
   - Select doctor
   - Choose date/time
   - Confirm booking
   - See in appointments list

4. Password reset
   - Click forgot password
   - Enter email
   - Check email for reset link
   - Reset password
   - Login with new password

5. Admin panel
   - Login as admin
   - View users
   - View doctors
   - Verify management functions
```

### Step 3: Setup Monitoring

**Option 1: Use Sentry for Error Tracking**

```bash
# Install Sentry
npm install @sentry/node

# Backend setup:
# backend/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
// ... rest of middleware
app.use(Sentry.Handlers.errorHandler());
```

**Option 2: Use LogRocket for Frontend**

```bash
# Install LogRocket
npm install logrocket

# client/main.jsx
import LogRocket from "logrocket";

if (process.env.NODE_ENV === "production") {
  LogRocket.init('your-project-id');
}
```

### Step 4: Setup Logging

**MongoDB Logs:**
- Check MongoDB Atlas dashboard for performance metrics
- Monitor slow queries
- Setup alerts for connection issues

**Backend Logs:**
```bash
# View logs on Railway:
# Dashboard → Logs tab → Backend service

# Or on your own server:
tail -f logs/backend.log
```

### Step 5: Setup Database Backups

**MongoDB Atlas:**
- Go to Backup settings
- Enable automated backups
- Set backup window during low traffic
- Test restore process

### Step 6: Configure Custom Domain

**For Railway/Render:**
- Navigate to deployment settings
- Add custom domain (e.g., api.yourdomain.com)
- Configure DNS at domain registrar
- Wait for propagation (up to 24 hours)

**For Vercel:**
- Go to Settings → Domains
- Add domain
- Follow DNS configuration
- Auto HTTPS enabled

---

## 🔍 Monitoring & Maintenance

### Daily Checks
```
✓ Login and test basic flow
✓ Check error logs
✓ Monitor API response times
✓ Check database connection
```

### Weekly Checks
```
✓ Review error logs
✓ Check storage usage
✓ Review user feedback
✓ Check email delivery
✓ Monitor server resources
```

### Monthly Tasks
```
✓ Review and optimize slow queries
✓ Check for security updates
✓ Update dependencies
✓ Review and archive old logs
✓ Test backup restoration
✓ Review error patterns
```

### Security Monitoring
```
✓ Monitor failed login attempts
✓ Check for suspicious API usage
✓ Review admin actions
✓ Monitor database access
✓ Check for vulnerabilities in dependencies
```

---

## 🐛 Troubleshooting

### Issue 1: Frontend Cannot Connect to Backend

**Symptoms:** API calls fail, CORS errors, 404 errors

**Solutions:**
```bash
# 1. Verify backend is running
curl https://backend-url/api/health

# 2. Check CORS configuration
# Should see CORS headers in response

# 3. Check frontend environment variable
# cat client/.env (should have correct API URL)

# 4. Check browser console for errors
# Right-click → Inspect → Console tab

# 5. Verify firewall isn't blocking
# If on own server: sudo ufw allow 6401
```

### Issue 2: MongoDB Connection Fails

**Symptoms:** "MongoDB connection error", application crashes

**Solutions:**
```bash
# 1. Check MONGO_URI is correct
echo $MONGO_URI

# 2. Test connection string manually
# mongosh "mongodb+srv://..."

# 3. Check MongoDB Atlas:
# - Network Access → Add IP (0.0.0.0/0 for development, specific IPs for production)
# - Database Access → User credentials

# 4. Check firewall
# MongoDB Atlas should be whitelisted
```

### Issue 3: Email Not Sending

**Symptoms:** OTP not received, password reset email not sent

**Solutions:**
```bash
# 1. Check email configuration in .env
# EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

# 2. For Gmail:
# - Enable 2FA
# - Generate app password
# - Use app password (not Gmail password)

# 3. Test manually
# node
# import nodemailer from 'nodemailer';
# const transporter = nodemailer.createTransport({...});
# await transporter.verify();
```

### Issue 4: Authentication Not Working

**Symptoms:** Login fails, cannot access protected routes

**Solutions:**
```bash
# 1. Check JWT_SECRET is set
echo $JWT_SECRET

# 2. Check token in localStorage
# Open DevTools → Application → LocalStorage

# 3. Check Authorization header is sent
# Open DevTools → Network → XHR
# Should see "Authorization: Bearer <token>"

# 4. Verify authMiddleware is protecting routes
# Check routes configuration
```

### Issue 5: Payment/Transaction Issues (if using payment gateway)

**Ensure:**
```
✓ Payment gateway credentials are in .env
✓ Payment webhook URLs are configured
✓ SSL certificate is valid
✓ Payment gateway IP is whitelisted
```

---

## 🔑 Essential Environment Variables

```env
# =========================
# BACKEND (.env)
# =========================

# Server
PORT=6401
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carenest_db

# Authentication
JWT_SECRET=<min 32 chars, random, strong>

# Frontend
FRONTEND_URL=https://yourdomain.com

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Logging (optional)
LOG_LEVEL=info
SENTRY_DSN=<if using Sentry>

# =========================
# FRONTEND (.env)
# =========================

VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📞 Support & Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Deployment Resources
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

### Troubleshooting
- Check server logs
- Review MongoDB Atlas metrics
- Check browser DevTools
- Use curl to test API endpoints manually

---

## 📊 Deployment Checklist (Copy to Notepad)

```
BEFORE DEPLOYMENT:
☐ All credentials removed from code
☐ Environment variables documented
☐ .gitignore configured
☐ Security fixes applied
☐ Input validation added
☐ Rate limiting added
☐ Tests passed locally
☐ Build successful
☐ No console errors

DURING DEPLOYMENT:
☐ Environment variables set on platform
☐ Database connection verified
☐ Email service configured
☐ SSL certificate installed
☐ Domain DNS configured
☐ CORS properly set

AFTER DEPLOYMENT:
☐ Health endpoint returns success
☐ Can register new user
☐ Can login with user
☐ Can search doctors
☐ Can book appointment
☐ Email notifications work
☐ Admin panel accessible
☐ Error monitoring setup
☐ Backups configured
☐ Logs accessible

ONGOING:
☐ Daily: Check logs
☐ Weekly: Review errors
☐ Monthly: Update dependencies
☐ Quarterly: Security audit
```

---

**Last Updated:** December 27, 2025  
**Status:** Production Ready (after fixes)  
**Deployment Time:** 2-4 hours  
**Post-Deployment Testing:** 1-2 hours
