const User = require("../models/User");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//POST => /api/auth/register
const register = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const userWithSameName = await User.findOne({ username }).cache();
  if (userWithSameName) {
    return res.status(400).json({ username: "Username already exists" });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({ username, password: hashedPassword });
  const savedUser = await user.save();
  const token = jwt.sign(
    {
      id: savedUser._id
    },
    process.env.JWT_SECRET
  );
  res.json({ token });
  next();
};
//POST => /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const user = await User.findOne({ username }).cache();
  if (!user) {
    return res.status(404).json({ username: "Username doesn't exist" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ password: "Password doesn't match" });
  }
  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

// GET => /api/auth/user
const getUser = async (req, res) => {
  if (!req.user) {
    return res.json({ isLoggedIn: false });
  }
  const response = {
    isLoggedIn: true,
    user: req.user,
    bookmarksCount: await Bookmark.countDocuments({ userId: req.user.id }).cache(
      req.user.id
    ),
    notificationsCount: await Notification.countDocuments({ userId: req.user.id }).cache(
      req.user.id
    )
  };
  res.json(response);
};

module.exports = { register, login, getUser };
