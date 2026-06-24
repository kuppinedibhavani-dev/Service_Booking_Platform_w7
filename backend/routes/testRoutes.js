const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/test-email", async (req, res) => {
  console.log("Test email route hit");

  await sendEmail(
    "kuppinedibhavani@gmail.com",
    "Test Email",
    "This is a test email from ServiceHub"
  );

  res.json({
    message: "Test email sent"
  });
});

module.exports = router;