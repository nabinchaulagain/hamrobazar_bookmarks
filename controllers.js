const { Bookmark, Notification, User } = require("./models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Scraper = require("./scraper");
// GET => /api/bookmarks
const getBookmarks = async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user.id }).sort("-bookmarkedAt");
  res.json(bookmarks);
};
// GET => /api/bookmarks/:bookmarkId
const getBookmark = async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.bookmarkId);
  const notifications = await Notification.find({
    bookmark: bookmark.id
  }).sort("-foundAt");
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
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
      criteria: req.body.criteria,
      userId: req.user.id
    });
    const bookmark = await newBookmark.save();
    res.json(bookmark);
    Scraper.getLatestItem(newBookmark.criteria).then((latestItem) => {
      bookmark.latestItem = latestItem;
      bookmark.save();
    });
  } catch (err) {
    console.log(err);
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
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
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
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
  await bookmark.remove();
  res.sendStatus(204);
};

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
  const notifications = await Notification.find({ userId: req.user.id }).sort("-foundAt");
  res.json(notifications);
};

//POST => /api/auth/register
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const userWithSameName = await User.findOne({ username });
  if (userWithSameName) {
    return res.status(400).send("Username already exists");
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({ username, password: hashedPassword });
  const savedUser = await user.save();
  const token = jwt.sign(
    {
      id: savedUser._id
    },
    process.env.JWT_SECRET
  );
  res.json({ token });
};
//POST => /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.sendStatus(404);
  }
  const isPasswordCorrect = await bcrypt.compare(password, await user.password);
  if (!isPasswordCorrect) {
    return res.sendStatus(401);
  }
  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

// GET => /api/auth/user
const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};
module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  getNewNotifications,
  getNotifications,
  notificationRecieved,
  register,
  login,
  getUser
};
