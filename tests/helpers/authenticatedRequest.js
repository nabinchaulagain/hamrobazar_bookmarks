const { randomStr } = require("./random");
const getAuthenticatedRequest = async (request) => {
  const response = await request.post("/api/auth/register").send({
    username: randomStr(10),
    password: randomStr(20)
  });
  const token = response.body.token;
  return {
    get: (url) => {
      return request.get(url).set("Authorization", `Bearer ${token}`);
    },
    post: (url) => {
      return request.post(url).set("Authorization", `Bearer ${token}`);
    },
    put: (url) => {
      return request.put(url).set("Authorization", `Bearer ${token}`);
    },
    patch: (url) => {
      return request.patch(url).set("Authorization", `Bearer ${token}`);
    },
    delete: (url) => {
      return request.delete(url).set("Authorization", `Bearer ${token}`);
    }
  };
};
module.exports = getAuthenticatedRequest;
