import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import { vi } from "vitest";

// Mock cloudinary upload to avoid network
vi.mock("../../config/cloudinary.js", () => ({
  uploadToCloudinary: vi.fn(async (path) => ({
    url: "https://cdn.example.com/fake.jpg",
    publicId: "public-123",
  })),
}));

function makeCookie(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return [`jwt=${token}; Path=/; HttpOnly`];
}

describe("Profile endpoints via onboarding", () => {
  it("completes onboarding and updates profilePic via mocked cloudinary", async () => {
    // Create user first
    const user = await User.create({
      fullName: "Onboard Me",
      email: "obo@test.com",
      password: "pass1234",
    });

    // Mark as not onboarded
    expect(user.isOnboarded).toBe(false);

    const res = await request(app)
      .post("/api/auth/onboarding")
      .set("Cookie", makeCookie(user._id.toString()))
      .send({
        fullName: "Onboard Me",
        bio: "hello",
        nativeLanguage: "english",
        learningLanguage: "spanish",
        location: "NY",
        image: "data:image/png;base64,iVBORw0...",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.user).toHaveProperty("isOnboarded", true);
    expect(res.body.user).toHaveProperty("profilePic");
  });
});
