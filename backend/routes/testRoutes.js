const sendEmail = require("../utils/sendEmail");

router.get("/test-email", async (req, res) => {
  await sendEmail(
    "kuppinedibhavani@gmail.com",
    "Test Mail",
    "This is a test email from ServiceHub"
  );

  res.send("Test email triggered");
});