const mongoose = require("mongoose");
const { getTimeFrom } = require("./utils");

const itemSchema = new mongoose.Schema({
  link: String,
  name: String,
  price: String
});

const bookmarkSchema = new mongoose.Schema({
  name: {
    type: String
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
    get: (val) => getTimeFrom(val)
  },
  criteria: { type: Object },
  latestItem: { type: itemSchema, select: false }
});

bookmarkSchema.set("toJSON", { getters: true });

const notificationSchema = new mongoose.Schema({
  bookmark: { type: mongoose.Types.ObjectId, ref: "Bookmark" },
  item: { type: itemSchema },
  foundAt: { type: Date, default: Date.now, get: (val) => getTimeFrom(val) },
  isNotified: { type: Boolean, default: false },
  isSeen: { type: Boolean, default: false }
});

notificationSchema.set("toJSON", { getters: true });

notificationSchema.post("find", (docs, next) => {
  next();
  for (const doc of docs) {
    if (!doc.isSeen) {
      doc.isSeen = true;
      doc.save();
    }
  }
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Bookmark, Notification };
