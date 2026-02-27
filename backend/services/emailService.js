const nodemailer = require('nodemailer');

// Mailtrap SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'api',
    pass: process.env.MAILTRAP_API_TOKEN, // your token from .env
  },
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
};