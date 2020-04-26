const mongoose = require("mongoose");
const itemSchema = require("./Item.schema");
const { getTimeFrom } = require("../utils/time");

const notificationSchema = new mongoose.Schema({
  bookmark: { type: mongoose.Types.ObjectId, ref: "Bookmark" },
  item: { type: itemSchema },
  foundAt: { type: Date, default: Date.now, get: (val) => getTimeFrom(val) },
  userId: mongoose.Types.ObjectId,
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

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
