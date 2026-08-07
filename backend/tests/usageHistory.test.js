const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

const User = require("../models/user");
const Category = require("../models/category");
const Service = require("../models/service");
const UsageHistory = require("../models/usageHistory");

let adminToken;
let userToken;

let adminId;
let userId;

let categoryId;
let serviceId;

beforeEach(async () => {
  await User.deleteMany();
  await Category.deleteMany();
  await Service.deleteMany();
  await UsageHistory.deleteMany();

  // register admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  // register user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });

  // login admin
  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "123456",
  });

  adminToken = adminLogin.body.token;

  const admin = await User.findOne({
    email: "admin@test.com",
  });

  adminId = admin._id.toString();

  // login user
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "123456",
  });

  userToken = userLogin.body.token;

  const user = await User.findOne({
    email: "user@test.com",
  });

  userId = user._id.toString();

  // create category
  const categoryResponse = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Utilities",
      description: "Utility services",
    });

  categoryId = categoryResponse.body.category._id;

  // create service
  const serviceResponse = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "GPA Calculator",
      slug: "gpa-calculator",
      description: "Calculate GPA",
      category: categoryId,
    });

  serviceId = serviceResponse.body.service._id;
});

describe("POST /api/usage", () => {
  test("user should record usage", async () => {
    const response = await request(app)
      .post("/api/usage")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.usage).toBeDefined();
    expect(response.body.usage.user).toBe(userId);
    expect(response.body.usage.service).toBe(serviceId);
  });
});
