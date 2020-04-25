const mongoose = require("mongoose");
require("dotenv").config();
module.exports = {
  connect: () => {
    return mongoose.connect(process.env.MONGO_URI + Date.now(), {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  },
  disconnect: async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
};
