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
