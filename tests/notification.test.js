const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const db = require("./helpers/db");
const { randomId } = require("./helpers/random");
beforeAll(async () => {
  await db.connect();
});
describe("notification routes test", () => {
  it("GET => /api/notifications should work", async () => {
    const response = await request.get("/api/notifications");
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(0);
  });
  it("GET => /api/notifications/new should work", async () => {
    const response = await request.get("/api/notifications/new");
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(0);
  });
  it("POST => /api/notifications/:id shouldn't work for non-existent notification", async () => {
    const response = await request.post(`/api/notifications/${randomId()}`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await db.disconnect();
});
