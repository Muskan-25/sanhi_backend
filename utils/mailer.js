const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('⚠️  Email functionality will not work without these variables!');
}

let transporter = null;

try {
  if (missingVars.length === 0) {
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: isSecure, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Increased timeouts for Render's network
      connectionTimeout: 60000, // 60 seconds (increased from 10)
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      // Additional options for better connection handling
      pool: true, // Use connection pooling
      maxConnections: 1,
      maxMessages: 3,
      // For TLS connections (port 587)
      requireTLS: !isSecure, // Require TLS for non-secure ports
      tls: {
        // Do not fail on invalid certificates (sometimes needed for Render)
        rejectUnauthorized: false,
      },
      // Retry options
      retry: {
        attempts: 3,
        delay: 2000, // 2 seconds between retries
      },
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
  } else {
    console.warn('⚠️  Transporter not created due to missing environment variables');
  }
} catch (error) {
  console.error('❌ Error creating transporter:', error);
}

module.exports = {transporter}
