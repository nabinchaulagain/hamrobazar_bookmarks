const { randomStr, randomInt } = require("./random");
const generateUserCredentials = () => {
  return {
    username: randomStr(11),
    password: randomStr(9)
  };
};
const generateBookmark = () => {
  return {
    name: randomStr(randomInt(5, 12)),
    criteria: {
      searchWord: randomStr(randomInt(5, 12))
    }
  };
};

module.exports = { generateUserCredentials, generateBookmark };
