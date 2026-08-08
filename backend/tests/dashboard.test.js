const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

let userToken;
let adminToken;
let categoryId;
let serviceId;

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

describe("GET /api/dashboard/stats", () => {
  test("admin should get dashboard statistics", async () => {
    const response = await request(app)
      .get("/api/dashboard/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.stats).toBeDefined();

    expect(response.body.stats.totalUsers).toBe(2);
    expect(response.body.stats.totalServices).toBe(1);
    expect(response.body.stats.totalCategories).toBe(1);
    expect(response.body.stats.totalReviews).toBe(0);
    expect(response.body.stats.totalFavorites).toBe(0);
    expect(response.body.stats.totalUsage).toBe(0);

    expect(response.body.generatedAt).toBeDefined();
  });

  test("should reject non-admin user", async () => {
    const response = await request(app)
      .get("/api/dashboard/stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should reject request without token", async () => {
    const response = await request(app).get("/api/dashboard/stats");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("should return correct statistics after platform activity", async () => {
    // Create a review
    await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Add favorite
    await request(app)
      .post("/api/favorites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    // Record usage
    await request(app)
      .post("/api/usage")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
      });

    const response = await request(app)
      .get("/api/dashboard/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.stats.totalUsers).toBe(2);
    expect(response.body.stats.totalServices).toBe(1);
    expect(response.body.stats.totalCategories).toBe(1);
    expect(response.body.stats.totalReviews).toBe(1);
    expect(response.body.stats.totalFavorites).toBe(1);
    expect(response.body.stats.totalUsage).toBe(1);
  });
});
