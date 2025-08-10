import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

function makeCookie(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return [`jwt=${token}; Path=/; HttpOnly`];
}

describe("User routes (protected)", () => {
  it("returns recommended users paginated", async () => {
    // Seed users
    const u1 = await User.create({
      fullName: "Ada",
      email: "a@a.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const u2 = await User.create({
      fullName: "Bob",
      email: "b@b.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const me = await User.create({
      fullName: "Me",
      email: "me@me.com",
      password: "pass1234",
      isOnboarded: true,
    });

    const res = await request(app)
      .get("/api/users?page=1&limit=1")
      .set("Cookie", makeCookie(me._id.toString()));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("recommendedUsers");
    expect(res.body.limit).toBe(1);
    expect(res.body.totalUsers).toBeGreaterThanOrEqual(2);
  });

  it("can send and accept a friend request", async () => {
    const sender = await User.create({
      fullName: "Sender",
      email: "s@s.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const recipient = await User.create({
      fullName: "Recipient",
      email: "r@r.com",
      password: "pass1234",
      isOnboarded: true,
    });

    // sender sends request
    const sendRes = await request(app)
      .post(`/api/users/friend-request/${recipient._id}`)
      .set("Cookie", makeCookie(sender._id.toString()));

    expect(sendRes.status).toBe(201);
    const reqId = sendRes.body._id;

    // recipient accepts
    const acceptRes = await request(app)
      .put(`/api/users/friend-request/${reqId}/accept`)
      .set("Cookie", makeCookie(recipient._id.toString()));

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body).toMatchObject({ success: true });
  });

  it("rejects unauthorized access with 401", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("lists outgoing and incoming requests, then accepted after approval", async () => {
    const sender = await User.create({
      fullName: "Alfa",
      email: "alfa@test.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const recipient = await User.create({
      fullName: "Beta",
      email: "beta@test.com",
      password: "pass1234",
      isOnboarded: true,
    });

    // sender -> recipient (pending)
    const sendRes = await request(app)
      .post(`/api/users/friend-request/${recipient._id}`)
      .set("Cookie", makeCookie(sender._id.toString()));
    expect(sendRes.status).toBe(201);
    const reqId = sendRes.body._id;

    // Outgoing for sender shows 1
    const outgoing = await request(app)
      .get("/api/users/outgoing-friend-requests")
      .set("Cookie", makeCookie(sender._id.toString()));
    expect(outgoing.status).toBe(200);
    expect(Array.isArray(outgoing.body)).toBe(true);
    expect(outgoing.body.length).toBe(1);

    // Incoming for recipient shows 1 pending, 0 accepted
    const incoming = await request(app)
      .get("/api/users/friend-requests")
      .set("Cookie", makeCookie(recipient._id.toString()));
    expect(incoming.status).toBe(200);
    expect(incoming.body.incomingReqs.length).toBe(1);
    expect(incoming.body.acceptedReqs.length).toBe(0);

    // Recipient accepts
    const acceptRes = await request(app)
      .put(`/api/users/friend-request/${reqId}/accept`)
      .set("Cookie", makeCookie(recipient._id.toString()));
    expect(acceptRes.status).toBe(200);

    // Sender now has 1 accepted
    const afterAcceptedForSender = await request(app)
      .get("/api/users/friend-requests")
      .set("Cookie", makeCookie(sender._id.toString()));
    expect(afterAcceptedForSender.status).toBe(200);
    expect(afterAcceptedForSender.body.acceptedReqs.length).toBe(1);
  });

  it("returns friends list", async () => {
    const me = await User.create({
      fullName: "Me",
      email: "me2@me.com",
      password: "pass1234",
      isOnboarded: true,
    });
    const pal = await User.create({
      fullName: "Pal",
      email: "pal@p.com",
      password: "pass1234",
      isOnboarded: true,
    });

    // Make them friends
    await User.findByIdAndUpdate(me._id, { $addToSet: { friends: pal._id } });
    await User.findByIdAndUpdate(pal._id, { $addToSet: { friends: me._id } });

    const res = await request(app)
      .get("/api/users/friends")
      .set("Cookie", makeCookie(me._id.toString()));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("fullName", "Pal");
  });

  it("gets, updates and deletes profile", async () => {
    const me = await User.create({
      fullName: "Profile Me",
      email: "profile@me.com",
      password: "pass1234",
      isOnboarded: true,
      bio: "hi",
    });

    // GET profile
    const getRes = await request(app)
      .get("/api/users/profile")
      .set("Cookie", makeCookie(me._id.toString()));
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty("email", "profile@me.com");

    // UPDATE profile
    const updateRes = await request(app)
      .put("/api/users/profile")
      .set("Cookie", makeCookie(me._id.toString()))
      .send({ fullName: "Updated Name", bio: "updated" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty("fullName", "Updated Name");
    expect(updateRes.body).toHaveProperty("bio", "updated");

    // DELETE profile
    const delRes = await request(app)
      .delete("/api/users/profile")
      .set("Cookie", makeCookie(me._id.toString()));
    expect(delRes.status).toBe(200);

    // Subsequent protected route should fail due to missing user
    const afterDelete = await request(app)
      .get("/api/users/profile")
      .set("Cookie", makeCookie(me._id.toString()));
    expect(afterDelete.status).toBe(401);
  });
});
