import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"DentalCare Pro" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', { messageId: result.messageId, to: options.to });
      return true;
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      return false;
    }
  }

  async sendAppointmentConfirmation(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<boolean> {
    const subject = 'Appointment Confirmation - DentalCare Pro';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been confirmed for:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Clinic:</strong> DentalCare Pro</p>
        </div>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>DentalCare Pro Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patientEmail,
      subject,
      html
    });
  }

  async sendAppointmentReminder(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<boolean> {
    const subject = 'Appointment Reminder - DentalCare Pro';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Reminder</h2>
        <p>Dear ${patientName},</p>
        <p>This is a reminder of your upcoming appointment:</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Clinic:</strong> DentalCare Pro</p>
        </div>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>If you need to reschedule or cancel, please contact us immediately.</p>
        <p>Best regards,<br>DentalCare Pro Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patientEmail,
      subject,
      html
    });
  }

  async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset - DentalCare Pro';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>You have requested to reset your password for your DentalCare Pro account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>DentalCare Pro Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }
}

export const emailService = new EmailService();
