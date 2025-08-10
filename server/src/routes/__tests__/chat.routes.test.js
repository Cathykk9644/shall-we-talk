import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

// Mock the stream token generator to avoid needing real keys
vi.mock("../../config/stream.js", () => ({
  generateStreamToken: vi.fn((userId) => `mock-token-for-${userId}`),
}));

function makeCookie(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return [`jwt=${token}; Path=/; HttpOnly`];
}

describe("Chat routes", () => {
  it("requires auth", async () => {
    const { default: app } = await import("../../app.js");
    const res = await request(app).get("/api/chat/streamToken");
    expect(res.status).toBe(401);
  });

  it("returns a stream token for authenticated user", async () => {
    const me = await User.create({
      fullName: "Chatter",
      email: "chat@test.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const { default: app } = await import("../../app.js");

    const res = await request(app)
      .get("/api/chat/streamToken")
      .set("Cookie", makeCookie(me._id.toString()));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("streamToken");
    expect(res.body.streamToken).toBe(`mock-token-for-${me._id.toString()}`);
  });
});
