const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const { randomId } = require("./helpers/random");
const { generateBookmark } = require("./helpers/factory");
const db = require("./helpers/db");
const getAuthenticatedRequest = require("./helpers/authenticatedRequest");
let authenticatedRequest;

beforeAll(async () => {
  await db.connect();
});

describe("When logged in", () => {
  beforeEach(async () => {
    authenticatedRequest = await getAuthenticatedRequest(request);
  });
  describe("GET => /api/bookmarks", () => {
    it("should work", async () => {
      const response = await authenticatedRequest.get("/api/bookmarks");
      expect(response.status).toEqual(200);
    });
  });
  describe("POST => /api/bookmark", () => {
    it("should create bookmark", async () => {
      const response = await authenticatedRequest
        .post("/api/bookmarks")
        .send(generateBookmark());
      expect(response.status).toEqual(200);
    });
    it("shouldn't create bookmark for invalid criteria", async () => {
      const response = await authenticatedRequest.post("/api/bookmarks");
      expect(response.status).toEqual(400);
    });
  });
  describe("DELETE => /api/bookmark", () => {
    it("should delete bookmark ", async () => {
      const { body } = await authenticatedRequest
        .post("/api/bookmarks")
        .send(generateBookmark());
      const bookmarkId = body._id;
      const response = await authenticatedRequest.delete(`/api/bookmarks/${bookmarkId}`);
      expect(response.status).toBe(204);
    });
    it("should not work for non-existent bookmark", async () => {
      const fakeId = randomId();
      const response = await authenticatedRequest.delete(`/api/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});

describe("When not logged in", () => {
  it("GET => /api/bookmarks is protected", async () => {
    const response = await request.get("/api/bookmarks");
    expect(response.status).toEqual(401);
  });
  it("POST => /api/bookmarks is protected", async () => {
    const response = await request.post("/api/bookmarks");
    expect(response.status).toEqual(401);
  });
  it("DELETE => /api/bookmarks is protected", async () => {
    const response = await request.delete(`/api/bookmarks/${randomId()}`);
    expect(response.status).toEqual(401);
  });
});

afterAll(async () => {
  await db.disconnect();
});
