const express = require("express");
const app = express();
const Controller = require("./controllers");
const { userDecoder, loginRequired } = require("./middlewares");
app.use(express.json());

app.use(userDecoder);
app.get("/api/bookmarks", loginRequired, Controller.getBookmarks);
app.get("/api/bookmarks/:bookmarkId", loginRequired, Controller.getBookmark);
app.post("/api/bookmarks", loginRequired, Controller.addBookmark);
app.patch("/api/bookmarks/:bookmarkId", loginRequired, Controller.updateBookmark);
app.delete("/api/bookmarks/:bookmarkId", loginRequired, Controller.deleteBookmark);
app.get("/api/notifications/new", loginRequired, Controller.getNewNotifications);
app.post(
  "/api/notifications/:notificationId",
  loginRequired,
  Controller.notificationRecieved
);
app.get("/api/notifications", loginRequired, Controller.getNotifications);
app.post("/api/auth/register", Controller.register);
app.post("/api/auth/login", Controller.login);
app.get("/api/auth/user", Controller.getUser);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res) => {
  res.sendStatus(500);
});

module.exports = app;
