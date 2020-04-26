const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userDecoder = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    try {
      const jwtToken = authorizationHeader.split(" ")[1];
      const decodedUser = jwt.decode(jwtToken);
      const user = await User.findById(decodedUser.id);
      if (!user) {
        return res.sendStatus(401);
      }
      req.user = user;
    } catch (err) {
      return res.sendStatus(401);
    }
  }
  next();
};
module.exports = userDecoder;
