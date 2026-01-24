const {transporter}  = require('../utils/mailer');
require('dotenv').config();

const sendContactMail = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // 🔍 Verify SMTP connection
    // await transporter.verify();

   await transporter.sendMail({
  from: `"StriveEdge" <${process.env.SMTP_USER}>`, // ✅ always Gmail
  to: process.env.SMTP_USER,
  replyTo: email, // ✅ user email goes here
  subject: subject || "New Contact Form Submission",
  html: `
    <div style="font-family: Arial; line-height:1.6">
      <h2 style="color:#0C6E6D;">New Contact Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    </div>
  `,
});


    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("SMTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Mail sending failed",
    });
  }
};



module.exports = {sendContactMail}
