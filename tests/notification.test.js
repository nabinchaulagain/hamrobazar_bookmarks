const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const db = require("./helpers/db");
const { randomId } = require("./helpers/random");
const getAuthenticatedRequest = require("./helpers/authenticatedRequest");
let authenticatedRequest;

beforeAll(async () => {
  await db.connect();
});
describe("When logged in", () => {
  beforeEach(async () => {
    authenticatedRequest = await getAuthenticatedRequest(request);
  });
  it("GET => /api/notifications should work", async () => {
    const response = await authenticatedRequest.get("/api/notifications");
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(0);
  });
  it("GET => /api/notifications/new should work", async () => {
    const response = await authenticatedRequest.get("/api/notifications/new");
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(0);
  });
  it("POST => /api/notifications/:id shouldn't work for non-existent notification", async () => {
    const response = await authenticatedRequest.post(`/api/notifications/${randomId()}`);
    expect(response.status).toBe(404);
  });
});

describe("When not logged in", () => {
  it("GET => /api/notifications is protected", async () => {
    const response = await request.get("/api/notifications");
    expect(response.status).toEqual(401);
  });
  it("POST => /api/notifications is protected", async () => {
    const response = await request.post("/api/notifications/new");
    expect(response.status).toEqual(401);
  });
  it("DELETE => /api/notifications/:id is protected", async () => {
    const response = await request.post(`/api/notifications/${randomId()}`);
    expect(response.status).toEqual(401);
  });
});

afterAll(async () => {
  await db.disconnect();
});
