require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendEmail } = require('../services/emailService');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to call this API
app.use(express.json()); // Parses JSON request bodies

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, projectType, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    await sendEmail({
      to: process.env.TO_EMAIL,
      subject: `New contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Project Type: ${projectType || 'Not specified'}

Message:
${message || 'No message'}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
<p><strong>Message:</strong></p>
<p>${message || 'No message'}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Export the app for Vercel (DO NOT use app.listen() here)
module.exports = app;

// For local development – only runs when you execute this file directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}