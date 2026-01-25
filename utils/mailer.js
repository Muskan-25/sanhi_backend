const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587, // Convert to number, default to 587
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465', // 465 is typically secure
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add connection timeout and retry options
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify connection on startup (optional, can be commented if causing issues)
if (process.env.NODE_ENV !== 'production') {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('❌ SMTP Connection Error:', error);
    } else {
      console.log('✅ SMTP Server is ready to send messages');
    }
  });
}

module.exports = {transporter}
