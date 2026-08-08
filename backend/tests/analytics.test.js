const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const Service = require("../models/service");

const UsageHistory = require("../models/usageHistory");

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

describe("GET /api/analytics/top-services", () => {
  test("admin should get top services", async () => {
    await request(app)
      .post("/api/usage")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    await request(app)
      .post("/api/usage")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    await request(app)
      .post("/api/usage")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    const response = await request(app)
      .get("/api/analytics/top-services")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.topServices).toBeDefined();
    expect(response.body.topServices.length).toBe(1);
    expect(response.body.topServices[0].totalUses).toBe(3);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get("/api/analytics/top-services")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app).get("/api/analytics/top-services");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("should return empty top services when there is no usage", async () => {
    const response = await request(app)
      .get("/api/analytics/top-services")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.topServices).toEqual([]);
  });
});

describe("GET /api/analytics/top-rated", () => {
  test("admin should get top rated services", async () => {
    const response = await request(app)
      .get("/api/analytics/top-rated")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.services).toBeDefined();
    expect(Array.isArray(response.body.services)).toBe(true);
  });

  test("should return services ordered by average rating", async () => {
    const service2 = await Service.create({
      name: "File Converter",
      slug: "file-converter",
      description: "Convert files",
      category: categoryId,
      averageRating: 4.2,
      reviewCount: 10,
    });

    await Service.findByIdAndUpdate(serviceId, {
      averageRating: 4.8,
      reviewCount: 20,
    });

    const response = await request(app)
      .get("/api/analytics/top-rated")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.services.length).toBe(2);

    expect(response.body.services[0].name).toBe("GPA Calculator");
    expect(response.body.services[0].averageRating).toBe(4.8);

    expect(response.body.services[1].name).toBe("File Converter");
    expect(response.body.services[1].averageRating).toBe(4.2);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get("/api/analytics/top-rated")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get("/api/analytics/top-rated")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app).get("/api/analytics/top-rated");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
