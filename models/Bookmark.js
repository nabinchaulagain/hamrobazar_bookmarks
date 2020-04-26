const mongoose = require("mongoose");
const itemSchema = require("./Item.schema");
const { getTimeFrom } = require("../utils/time");
const bookmarkSchema = new mongoose.Schema({
  name: {
    type: String
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
    get: (val) => getTimeFrom(val)
  },
  userId: mongoose.Types.ObjectId,
  criteria: { type: Object },
  latestItem: { type: itemSchema, select: false }
});

bookmarkSchema.set("toJSON", { getters: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
