require("dotenv").config();
const mongoose = require("mongoose");
require("./services/cache");
const app = require("./app");

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`server started at ${PORT}`);
    });
    console.log("MongoDB started");
  }
);
