const { Bookmark, Notification } = require("./models");
const Scraper = require("./scraper");
// GET => /api/bookmarks
const getBookmarks = async (req, res) => {
  const bookmarks = await Bookmark.find().sort("-bookmarkedAt");
  res.json(bookmarks);
};
// GET => /api/bookmarks/:bookmarkId
const getBookmark = async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.bookmarkId);
  const notifications = await Notification.find({
    bookmark: bookmark.id
  }).sort("-foundAt");
  res.json({ ...bookmark.toJSON(), notifications });
};

// POST => /api/bookmarks
const addBookmark = async (req, res) => {
  try {
    if (Bookmark.count() >= 10) {
      return res.status(400).send("max count exceeded");
    }
    if (!req.body.name || !req.body.criteria) {
      return res.status(400).send("missing");
    }
    const newBookmark = new Bookmark({
      name: req.body.name,
      criteria: req.body.criteria
    });
    newBookmark.latestItem = await Scraper.getLatestItem(newBookmark.criteria);
    const bookmark = await newBookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.log("msg", err.message);
    console.log("line number", err.line);
    console.log("name", err.name);
  }
};

// PATCH => /api/bookmarks/:bookmarkId
const updateBookmark = async (req, res) => {
  if (!req.body.name || !req.body.criteria || !req.params.bookmarkId) {
    return res.status(400).send("missing");
  }
  const bookmark = await Bookmark.findById(req.params.bookmarkId);
  if (!bookmark) {
    return res.status(400).send("missing");
  }
  bookmark.name = req.body.name;
  bookmark.criteria = req.body.criteria;
  res.json(await bookmark.save());
};

// DELETE => /api/bookmarks/:bookmarkId
const deleteBookmark = async (req, res) => {
  if (!req.params.bookmarkId) {
    return res.status(400).send("missing");
  }
  const bookmark = await Bookmark.findById(req.params.bookmarkId);
  if (!bookmark) {
    return res.sendStatus(404);
  }
  await bookmark.remove();
  res.sendStatus(204);
};

// GET => /api/notifications/new
const getNewNotifications = async (req, res) => {
  const newNotifications = await Notification.find({
    isSeen: false
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
  notification.isNotified = true;
  notification.save();
  res.sendStatus(204);
};

// GET => /api/notifications
const getNotifications = async (req, res) => {
  const notifications = await Notification.find().sort("-foundAt");
  res.json(notifications);
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  getNewNotifications,
  getNotifications,
  notificationRecieved
};
