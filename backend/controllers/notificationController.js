const Notification = require("../models/Notification");

// Create Notification
const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = await Notification.create({
      userId,
      message,
      type
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Mark as Read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};