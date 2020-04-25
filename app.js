const express = require("express");
const app = express();
const Controller = require("./controllers");
const { userDecoder } = require("./middlewares");
app.use(express.json());

app.use(userDecoder);
app.get("/api/bookmarks", Controller.getBookmarks);
app.get("/api/bookmarks/:bookmarkId", Controller.getBookmark);
app.post("/api/bookmarks", Controller.addBookmark);
app.patch("/api/bookmarks/:bookmarkId", Controller.updateBookmark);
app.delete("/api/bookmarks/:bookmarkId", Controller.deleteBookmark);
app.get("/api/notifications/new", Controller.getNewNotifications);
app.post("/api/notifications/:notificationId", Controller.notificationRecieved);
app.get("/api/notifications", Controller.getNotifications);
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
