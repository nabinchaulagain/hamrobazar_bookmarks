const jwt = require("jsonwebtoken");
const userDecoder = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const jwtToken = authorizationHeader.split(" ")[1];
    const decodedUser = jwt.decode(jwtToken);
    req.user = decodedUser;
  }
  next();
};

const loginRequired = async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
};
module.exports = { userDecoder, loginRequired };
