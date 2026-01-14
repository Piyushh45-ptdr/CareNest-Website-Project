import dotenv from "dotenv";
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // service: process.env.EMAIL_SERVICE || 'gmail',
  host: "smtp.gmail.com",
port: 587,
secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    // Log OTP to console for testing
    console.log(`📧 OTP for ${email}: ${otp}`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CareNest - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">CareNest - Your Health, Our Priority</h2>
          <p>Dear User,</p>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes. Do not share this with anyone.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br/>CareNest Team</p>
        </div>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully');
    } else {
      console.warn('⚠️ Email credentials not configured, skipping email send');
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message);
    // Don't fail registration if email fails
    return true;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetUrl - Reset password URL with token
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    console.log(`📧 Password reset URL for ${email}: ${resetUrl}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CareNest - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">CareNest - Password Reset</h2>
          <p>Dear User,</p>
          <p>We received a request to reset your password. Click the button below to reset it.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p><strong>⏱️ This link will expire in 30 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br/>CareNest Team</p>
        </div>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully');
    } else {
      console.warn('⚠️ Email credentials not configured, skipping email send');
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    throw error;
  }
};