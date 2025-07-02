const nodemailer = require('nodemailer');

async function sendEmail({ emailType, email, appPassword, to, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: emailType === 'gmail' ? 'gmail' : 'Outlook365',
    auth: { user: email, pass: appPassword }
  });

  await transporter.sendMail({
    from: email,
    to,
    subject,
    text
  });
}

module.exports = { sendEmail };
