const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;