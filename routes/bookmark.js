const express = require("express");
const BookmarkController = require("../controllers/Bookmark");
const clearCache = require("../middlewares/clearCache");

const router = express.Router();
router.get("/", BookmarkController.getBookmarks);
router.get("/:bookmarkId", BookmarkController.getBookmark);
router.post("/", BookmarkController.addBookmark, clearCache("userCache"));
router.patch("/:bookmarkId", BookmarkController.updateBookmark, clearCache("userCache"));
router.delete("/:bookmarkId", BookmarkController.deleteBookmark, clearCache("userCache"));

module.exports = router;
