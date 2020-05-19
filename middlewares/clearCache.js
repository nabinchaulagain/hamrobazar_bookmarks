const { clearHash } = require("../services/cache");

const clearCache = (key = "default") => {
  return (req) => {
    if (key === "default") {
      clearHash("default");
    } else if (key === "userCache") {
      clearHash(req.user.id);
    }
  };
};

module.exports = clearCache;
