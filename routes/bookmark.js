const express = require("express");
const BookmarkController = require("../controllers/Bookmark");

const router = express.Router();
router.get("/", BookmarkController.getBookmarks);
router.get("/:bookmarkId", BookmarkController.getBookmark);
router.post("/", BookmarkController.addBookmark);
router.patch("/:bookmarkId", BookmarkController.updateBookmark);
router.delete("/:bookmarkId", BookmarkController.deleteBookmark);

module.exports = router;
