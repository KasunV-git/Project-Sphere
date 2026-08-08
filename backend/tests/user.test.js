const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/user");

let adminToken;
let userToken;

let adminId;
let userId;

beforeEach(async () => {
  await mongoose.connection.dropDatabase();

  // Create admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  // Create normal user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });

  // Login admin
  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "123456",
  });

  adminToken = adminLogin.body.token;

  // Get admin ID directly from database
  const admin = await User.findOne({
    email: "admin@test.com",
  });

  adminId = admin._id.toString();

  // Login user
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "123456",
  });

  userToken = userLogin.body.token;

  // Get user ID directly from database
  const user = await User.findOne({
    email: "user@test.com",
  });

  userId = user._id.toString();
});

describe("GET /api/users", () => {
  test("admin should get all users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(response.body.users).toBeDefined();
    expect(response.body.users.length).toBe(2);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("should not return user passwords", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);

    response.body.users.forEach((user) => {
      expect(user.password).toBeUndefined();
    });
  });
});

describe("GET /api/users/:id", () => {
  test("admin should get user by ID", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
    expect(response.body.user._id).toBe(userId);
    expect(response.body.user.name).toBe("User");
    expect(response.body.user.email).toBe("user@test.com");
  });

  test("should return 404 for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("should reject invalid ObjectId", async () => {
    const response = await request(app)
      .get("/api/users/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe("PUT /api/users/:id", () => {
  test("admin should update user", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated User",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe("Updated User");
    expect(response.body.user.email).toBe("user@test.com");
  });

  test("admin should update user role", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "admin",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.role).toBe("admin");
  });

  test("should return 404 for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated User",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("should reject invalid ObjectId", async () => {
    const response = await request(app)
      .put("/api/users/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated User",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Updated User",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: "Updated User",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe("DELETE /api/users/:id", () => {
  test("admin should delete user", async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User deleted");

    const deletedUser = await User.findById(userId);

    expect(deletedUser).toBeNull();
  });

  test("should return 404 for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("should reject invalid ObjectId", async () => {
    const response = await request(app)
      .delete("/api/users/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .delete(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
