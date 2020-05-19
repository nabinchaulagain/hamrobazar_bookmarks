const Notification = require("../models/Notification");
// GET => /api/notifications/new
const getNewNotifications = async (req, res) => {
  const newNotifications = await Notification.find({
    isSeen: false,
    userId: req.user.id
  })
    .sort("-foundAt")
    .populate("bookmark", { name: 1, _id: 0 });
  res.json(newNotifications);
};

// POST => /api/notifications/:notificationID
const notificationRecieved = async (req, res) => {
  if (!req.params.notificationId) {
    return res.sendStatus(400);
  }
  const notification = await Notification.findById(req.params.notificationId);
  if (!notification) {
    return res.sendStatus(404);
  }
  if (notification.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
  notification.isNotified = true;
  notification.save();
  res.sendStatus(204);
};

// GET => /api/notifications
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .cache(req.user.id)
    .sort("-foundAt");
  res.json(notifications);
};

module.exports = {
  getNewNotifications,
  getNotifications,
  notificationRecieved
};
