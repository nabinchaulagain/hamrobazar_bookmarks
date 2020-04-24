const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const { randomStr, randomInt, randomId } = require("./helpers/random");
const db = require("./helpers/db");

beforeAll(async () => {
  await db.connect();
});

describe("bookmark route test", () => {
  describe("GET => /api/bookmarks", () => {
    it("should work", async () => {
      const response = await request.get("/api/bookmarks");
      expect(response.status).toEqual(200);
    });
  });
  describe("POST => /api/bookmark", () => {
    it("should create bookmark", async () => {
      const response = await request.post("/api/bookmarks").send({
        name: randomStr(randomInt(5, 12)),
        criteria: {
          searchWord: randomStr(randomInt(5, 12))
        }
      });
      expect(response.status).toEqual(200);
    });
    it("shouldn't create bookmark for invalid criteria", async () => {
      const response = await request.post("/api/bookmarks").send({
        name: randomStr(randomInt(5, 12))
      });
      expect(response.status).toEqual(400);
    });
  });
  describe("DELETE => /api/bookmark", () => {
    it("should delete bookmark ", async () => {
      const getResponse = await request.get("/api/bookmarks");
      if (getResponse.length > 0) {
        const bookmarkId = getResponse[0]._id;
        const response = await request.delete(`/api/bookmarks/${bookmarkId}`);
        expect(response.status).toBe(204);
      }
    });
    it("should not work for non-existent bookmark", async () => {
      const fakeId = randomId();
      const response = await request.delete(`/api/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});

afterAll(async () => {
  await db.disconnect();
});
