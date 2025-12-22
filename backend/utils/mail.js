import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
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

    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
