const mongoose = require("mongoose");
module.exports = {
  connect: () => {
    return mongoose.connect(process.env.MONGO_URI + "_test", {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  },
  disconnect: async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
};
