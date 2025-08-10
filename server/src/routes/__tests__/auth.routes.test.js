import request from "supertest";
import app from "../../app.js";

describe("Auth routes", () => {
  it("signup then login", async () => {
    const email = "ada@example.com";
    const password = "pass1234";
    const fullName = "Ada Lovelace";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({ fullName, email, password });
    expect(signup.status).toBeLessThan(400);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("success", true);
    expect(login.body).toHaveProperty("user");
  });
});
