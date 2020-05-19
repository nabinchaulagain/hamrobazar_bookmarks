const mongoose = require("mongoose");
const itemSchema = require("./Item.schema");
const bookmarkSchema = new mongoose.Schema({
  name: {
    type: String
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now
  },
  userId: mongoose.Types.ObjectId,
  criteria: { type: Object },
  latestItem: { type: itemSchema, select: false }
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
