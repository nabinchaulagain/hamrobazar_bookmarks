const crypto = require("crypto");
const mongoose = require("mongoose");
function randomInt(start, stop) {
  return Math.floor(Math.random() * (stop - start + 1) + start);
}
function randomStr(length) {
  return crypto.randomBytes(length).toString("hex");
}
function randomId() {
  return new mongoose.Types.ObjectId();
}
module.exports = { randomInt, randomStr, randomId };
