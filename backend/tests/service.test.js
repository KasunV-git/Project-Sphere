const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

const User = require("../models/user");
const Category = require("../models/category");

let adminToken;
let userToken;
let categoryId;

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

  // Login user
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "123456",
  });

  userToken = userLogin.body.token;

  // Create category directly
  const category = await Category.create({
    name: "Utilities",
    description: "Utility services",
  });

  categoryId = category._id;
});

describe("Service API", () => {
  describe("POST /api/services", () => {
    test("admin should create a service", async () => {
      const response = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "GPA Calculator",
          slug: "gpa-calculator",
          description: "Calculate GPA",
          category: categoryId,
        });

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.service).toBeDefined();

      expect(response.body.service.name).toBe("GPA Calculator");
    });
  });
});
