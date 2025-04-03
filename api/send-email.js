import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || 'Message from Portfolio Contact Form',
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`,
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      message: 'Error sending email',
      error: error.message 
    });
  }
}