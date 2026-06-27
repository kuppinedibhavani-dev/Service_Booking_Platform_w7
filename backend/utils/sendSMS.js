const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, body) => {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE,
      to
    });

    console.log("SMS sent successfully");
  } catch (error) {
    console.log("SMS error:", error.message);
  }
};

module.exports = sendSMS;