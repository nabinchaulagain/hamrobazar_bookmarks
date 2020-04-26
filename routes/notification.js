const express = require("express");
const NotificationController = require("../controllers/Notification");

const router = express.Router();
router.get("/new", NotificationController.getNewNotifications);
router.post("/:notificationId", NotificationController.notificationRecieved);
router.get("/", NotificationController.getNotifications);

module.exports = router;
