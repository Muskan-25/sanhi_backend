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

    console.log('📧 Attempting to send email...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
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
    });
    
    res.status(500).json({
      success: false,
      message: "Mail sending failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};



module.exports = {sendContactMail}
