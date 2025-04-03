import nodemailer from 'nodemailer';

export default async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the JSON body
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true
    });

    // Create email template with blue header
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          background-color: #0d6efd;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 0 0 5px 5px;
        }
        .details {
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          margin-top: 15px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #6c757d;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>New Message From Your Portfolio</h2>
      </div>
      <div class="content">
        <p>You've received a new message from your portfolio website:</p>
        
        <div class="details">
          <p><strong>From:</strong> ${name} (${email})</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="footer">
          <p>This email was sent automatically from your portfolio contact form.</p>
          <p>© ${new Date().getFullYear()} Chisom Okaro - Portfolio</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || 'New message from your portfolio',
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'No subject'}\nMessage: ${message}`,
      html: emailTemplate,
    });

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      message: 'Error sending email',
      error: error.message 
    });
  }
};