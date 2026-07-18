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

  test("normal user should not create a service", async () => {
    const response = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Image Upscaler",
        slug: "image-upscaler",
        description: "Upscale images",
        category: categoryId,
      });

    expect(response.statusCode).toBe(403);

    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app).post("/api/services").send({
      name: "Image Upscaler",
      slug: "image-upscaler",
      description: "Upscale images",
      category: categoryId,
    });

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test("should reject invalid category", async () => {
    const invalidCategory = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Image Upscaler",
        slug: "image-upscaler",
        description: "Upscale images",
        category: invalidCategory,
      });

    expect(response.statusCode).toBe(404);

    expect(response.body.success).toBe(false);
  });

  describe("GET /api/services", () => {
    let serviceId;

    beforeEach(async () => {
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
  });

  test("should get all services", async () => {
    const response = await request(app).get("/api/services");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.services).toBeDefined();

    expect(Array.isArray(response.body.services)).toBe(true);

    expect(response.body.services.length).toBe(1);
  });

  test("should get service by id", async () => {
    const response = await request(app).get(`/api/services/${serviceId}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.service.name).toBe("GPA Calculator");
  });

  test("should return 404 for non-existing service", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/api/services/${fakeId}`);

    expect(response.statusCode).toBe(404);

    expect(response.body.success).toBe(false);
  });

  test("should reject invalid service id", async () => {
    const response = await request(app).get("/api/services/invalid-id");

    expect(response.statusCode).toBe(500);

    expect(response.body.success).toBe(false);
  });
});
