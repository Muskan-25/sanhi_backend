const transporter  = require('../utils/mailer');

const sendContactMail = async (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `📩 New Contact Request`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>New Contact Request</h2>
          <table cellpadding="8">
            <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${phone || "-"}</td></tr>
            <tr><td><strong>Subject:</strong></td><td>${subject || "-"}</td></tr>
          </table>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <small>StriveEdge Website Contact Form</small>
        </div>
      `,
    });

    res.json({ success: true, message: "Mail sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Mail sending failed" });
  }
};


module.exports = {sendContactMail}