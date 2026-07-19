const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

let userToken;
let adminToken;
let serviceId;
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

  // Create category
  const category = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Utilities",
      description: "Utility tools",
    });

  categoryId = category.body.category._id;

  // Create service
  const service = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "GPA Calculator",
      slug: "gpa-calculator",
      description: "Calculate GPA",
      category: categoryId,
    });

  serviceId = service.body.service._id;
});

describe("Favorite API", () => {
  describe("POST /api/favorites", () => {
    test("user should add favorite", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          service: serviceId,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.favorite).toBeDefined();
    });

    test("should reject request without token", async () => {
      const response = await request(app).post("/api/favorites").send({
        service: serviceId,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("should return 404 for non-existing service", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          service: fakeId,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test("should reject invalid ObjectId", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          service: "invalid-id",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
