const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");
const { saveLatestItemInBookmark } = require("../utils/bookmark");

// GET => /api/bookmarks
const getBookmarks = async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user.id })
    .cache(req.user.id)
    .sort("-bookmarkedAt");
  res.json(bookmarks);
};
// GET => /api/bookmarks/:bookmarkId
const getBookmark = async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.bookmarkId).cache(req.user.id);
  const notifications = await Notification.find({
    bookmark: bookmark.id
  })
    .cache(req.user.id)
    .sort("-foundAt");
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
  res.json({ ...bookmark.toJSON(), notifications });
};

// POST => /api/bookmarks
const addBookmark = async (req, res, next) => {
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
    await saveLatestItemInBookmark(bookmark);
    res.json(bookmark);
    next();
  } catch (err) {
    console.log(err);
  }
};

// PATCH => /api/bookmarks/:bookmarkId
const updateBookmark = async (req, res, next) => {
  if (!req.body.name || !req.body.criteria || !req.params.bookmarkId) {
    return res.status(400).send("missing");
  }
  const bookmark = await Bookmark.findById(req.params.bookmarkId).cache(req.user.id);
  if (!bookmark) {
    return res.status(400).send("missing");
  }
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
  bookmark.name = req.body.name;
  bookmark.criteria = req.body.criteria;
  res.json(await bookmark.save());
  next();
};

// DELETE => /api/bookmarks/:bookmarkId
const deleteBookmark = async (req, res, next) => {
  if (!req.params.bookmarkId) {
    return res.status(400).send("missing");
  }
  const bookmark = await Bookmark.findById(req.params.bookmarkId).cache(req.user.id);
  if (!bookmark) {
    return res.sendStatus(404);
  }
  if (bookmark.userId.toString() !== req.user.id.toString()) {
    return res.sendStatus(403);
  }
  await bookmark.remove();
  res.sendStatus(204);
  next();
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  updateBookmark,
  deleteBookmark
};
