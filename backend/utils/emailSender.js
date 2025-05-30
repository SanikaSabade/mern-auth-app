const nodemailer = require('nodemailer');

const emailSender = async (options) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject, 
    html: options.message,    
  };

  await transporter.sendMail(mailOptions);
};

module.exports = emailSender;
