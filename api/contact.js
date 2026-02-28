import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, projectType, message } = req.body;

  // 2. Setup Transporter
  const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: 'api',
      pass: process.env.MAILTRAP_API_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      subject: `New Message from ${name}`,
      text: `Project: ${projectType}\nMessage: ${message}\nReply to: ${email}`,
      html: `<h3>New Contact</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}