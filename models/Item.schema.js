const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  link: String,
  name: String,
  price: String
});

module.exports = itemSchema;
