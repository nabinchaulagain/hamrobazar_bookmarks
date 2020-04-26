const mongoose = require("mongoose");
const { getTimeFrom } = require("../utils/time");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  joinedAt: { type: Date, default: Date.now, get: (val) => getTimeFrom(val) }
});
userSchema.set("toJSON", { getters: true });
const User = mongoose.model("User", userSchema);

module.exports = User;
