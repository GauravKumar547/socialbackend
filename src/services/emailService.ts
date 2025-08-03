import nodemailer from 'nodemailer';
import { createError } from '../utils/errorHandler';

export class EmailService {
    private static transporter: nodemailer.Transporter;

    /**
     * Initialize email transporter
     */
    static initialize() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    /**
     * Send password reset email
     */
    static async sendPasswordResetEmail(email: string, resetToken: string, username: string): Promise<void> {
        if (!this.transporter) {
            this.initialize();
        }

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello ${username},</p>
                    <p>You have requested to reset your password. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <p>This link will expire in 1 hour for security reasons.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw createError('Failed to send password reset email', 500);
        }
    }
} 