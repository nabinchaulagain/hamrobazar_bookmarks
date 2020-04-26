const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//POST => /api/auth/register
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const userWithSameName = await User.findOne({ username });
  if (userWithSameName) {
    return res.status(400).send("Username already exists");
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
};
//POST => /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.sendStatus(404);
  }
  const isPasswordCorrect = await bcrypt.compare(password, await user.password);
  if (!isPasswordCorrect) {
    return res.sendStatus(401);
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
  const user = await User.findById(req.user.id);
  res.json(user);
};

module.exports = { register, login, getUser };
