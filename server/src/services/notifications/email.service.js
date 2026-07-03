import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

// Setup email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

/**
 * Send an email
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Subject line
 * @param {string} params.text - Plain text body
 * @param {string} params.html - Optional HTML body
 */
export async function sendEmail({ to, subject, text, html }) {
  // If email configuration is missing, log to console instead (graceful fallback)
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.log(`[Email Service Bypass - Missing Configuration]
To: ${to}
Subject: ${subject}
Body: ${text}`);
    return;
  }

  const mailOptions = {
    from: `"HostelOS" <${env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send OTP Code for account activation
 * @param {string} to - Recipient email address
 * @param {string} otpCode - 6-digit verification code
 * @param {string} studentName - Student's name for personalization
 */
export async function sendActivationOtp(to, otpCode, studentName) {
  const subject = 'Activate Your HostelOS Account';
  
  const text = `Hello ${studentName},

Welcome to HostelOS! 

To activate your hostel account and set your password, please use the following 6-digit verification code:

Verification Code: ${otpCode}

This code is valid for 10 minutes. If you did not request this activation, please ignore this email.

Best regards,
HostelOS Management Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 24px;">HostelOS</h2>
        <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">Resident Portal Activation</p>
      </div>
      <p style="font-size: 16px; color: #1f2937;">Hello <strong>${studentName}</strong>,</p>
      <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">Welcome to HostelOS! To complete your resident account activation and set up a secure password, please use the 6-digit verification code below:</p>
      
      <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; border: 1px solid #e5e7eb;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; font-family: monospace;">${otpCode}</span>
      </div>

      <p style="font-size: 14px; color: #6b7280;">This code is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this message.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
        <p>HostelOS Management Team</p>
        <p style="margin-top: 4px;">This is an automated message. Please do not reply directly to this email.</p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}
