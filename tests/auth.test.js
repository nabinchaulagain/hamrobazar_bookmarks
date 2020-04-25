const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const db = require("./helpers/db");
const { randomStr } = require("./helpers/random");

beforeAll(async () => {
  await db.connect();
});

describe("Auth routes work for", () => {
  describe("POST => /api/auth/register", () => {
    it("should generate token", async () => {
      const username = randomStr(6);
      const password = randomStr(9);
      const response = await request.post("/api/auth/register").send({
        username,
        password
      });
      expect(response.status).toEqual(200);
      expect(response.body.token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );
    });
    it("shouldn't work", async () => {
      const response = await request.post("/api/auth/register");
      expect(response.status).toEqual(400);
    });
  });

  describe("POST => /api/auth/login", () => {
    it("shouldn't log user in with invalid credentials", async () => {
      const username = randomStr(6);
      const password = randomStr(9);
      const response = await request.post("/api/auth/login").send({
        username,
        password
      });
      expect(response.status).toEqual(404);
    });
    it("should log user in", async () => {
      const credentials = {
        username: randomStr(6),
        password: randomStr(9)
      };
      await request.post("/api/auth/register").send(credentials);
      const response = await request.post("/api/auth/login").send(credentials);
      expect(response.status).toEqual(200);
      expect(response.body.token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );
    });
  });
  it("GET => /api/auth/user should give logged in user", async () => {
    const credentials = {
      username: randomStr(6),
      password: randomStr(9)
    };
    const registerResponse = await request.post("/api/auth/register").send(credentials);
    const token = registerResponse.body.token;
    const response = await request
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${token}`);
    const recievedUser = response.body.username;
    expect(recievedUser).toEqual(credentials.username);
  });
});

afterAll(async () => {
  await db.disconnect();
});
