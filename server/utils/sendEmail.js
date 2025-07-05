
const nodemailer = require('nodemailer');

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });

  const mailOptions = {
    from: 'SkillMint Team <no-reply@skillmint.in>',
    to: toEmail,
    subject: '🔐 Verify Your Email – SkillMint OTP Inside',
    text: `
Hi there,

Welcome to SkillMint! To complete your signup, please use the One-Time Password (OTP) below:

🔑 OTP: ${otp}

This OTP is valid for 5 minutes. 
Do not share it with anyone for security reasons.

If you didn't request this, please ignore this email.

Cheers,  
SkillMint Team
`,
    html: `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2>👋 Welcome to <span style="color:#3B82F6;">SkillMint</span>!</h2>
  <p>To complete your signup, use the OTP below:</p>
  <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #3B82F6;">
    ${otp}
  </div>
  <p>This OTP is valid for <strong>5 minutes</strong>. Please <strong>do not share</strong> it with anyone.</p>
  <p>If you didn’t request this, just ignore this message.</p>
  <br/>
  <p style="font-size: 14px; color: #666;">– SkillMint Team</p>
</div>
`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
