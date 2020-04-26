const express = require("express");
const userDecoder = require("./middlewares/userDecoder");
const ensureAuthenticated = require("./middlewares/ensureAuthenticated");
const bookmarkRoutes = require("./routes/bookmark");
const notificationRoutes = require("./routes/notification");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(userDecoder);

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", ensureAuthenticated, bookmarkRoutes);
app.use("/api/notifications", ensureAuthenticated, notificationRoutes);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res) => {
  res.sendStatus(500);
});

module.exports = app;
