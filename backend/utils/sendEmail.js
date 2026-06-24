const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"ServiceHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #4f46e5;">${subject}</h2>
          <p>${message}</p>
          <br/>
          <p>Thank you for using ServiceHub 🚀</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email error:", error.message);
  }
};

module.exports = sendEmail;