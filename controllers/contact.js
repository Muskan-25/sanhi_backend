const {transporter}  = require('../utils/mailer');
require('dotenv').config();

const sendContactMail = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Check if transporter is available
    if (!transporter) {
      console.error('❌ Transporter is not available. Check environment variables.');
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please contact the administrator.",
        error: process.env.NODE_ENV === 'development' ? 'Transporter not initialized' : undefined,
      });
    }

    console.log('📧 Attempting to send email...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST || 'Not set',
      port: process.env.SMTP_PORT || 'Not set',
      user: process.env.SMTP_USER ? 'Set' : 'Missing',
      pass: process.env.SMTP_PASS ? 'Set' : 'Missing',
    });

    await transporter.sendMail({
      from: `"StriveEdge" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      html: `
        <div style="font-family: Arial; line-height:1.6">
          <h2 style="color:#0C6E6D;">New Contact Request</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || 'Not provided'}</p>
          <p><b>Subject:</b> ${subject || 'No subject'}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully');
    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("❌ SMTP ERROR:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
      stack: error.stack,
    });
    
    // Provide more helpful error messages
    let errorMessage = "Mail sending failed";
    if (error.code === 'EAUTH') {
      errorMessage = "Authentication failed. Please check SMTP credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Could not connect to SMTP server.";
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = "Connection to SMTP server timed out.";
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};



module.exports = {sendContactMail}
