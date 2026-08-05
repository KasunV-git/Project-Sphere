const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

const User = require("../models/user");
const Category = require("../models/category");
const Service = require("../models/service");
const Review = require("../models/review");

let adminToken;
let userToken;

let categoryId;
let serviceId;

beforeEach(async () => {
  await User.deleteMany();
  await Category.deleteMany();
  await Service.deleteMany();
  await Review.deleteMany();

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

  // login user
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "123456",
  });

  userToken = userLogin.body.token;

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

describe("POST /api/reviews", () => {
  test("user should create a review", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.review).toBeDefined();
    expect(response.body.review.rating).toBe(5);
    expect(response.body.review.comment).toBe("Excellent service");
  });

  test("should reject request without token", async () => {
    const response = await request(app).post("/api/reviews").send({
      service: serviceId,
      rating: 5,
      comment: "Excellent service",
    });

    expect(response.statusCode).toBe(401);
  });

  test("should return 404 for non-existing service", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Excellent service",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Service not found");
  });

  test("should reject invalid service ObjectId", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: "invalid-id",
        rating: 5,
        comment: "Excellent service",
      });

    expect(response.statusCode).toBe(400);
  });

  test("should not allow duplicate reviews", async () => {
    await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 4,
        comment: "Updated comment",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("You already reviewed this service");
  });

  test("should reject invalid rating", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 10,
        comment: "Excellent service",
      });

    expect(response.statusCode).toBe(400);
  });

  test("should reject missing comment", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
      });

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/reviews/service/:serviceId", () => {
  test("should get reviews for a service", async () => {
    await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const response = await request(app).get(
      `/api/reviews/service/${serviceId}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.reviews).toHaveLength(1);
    expect(response.body.reviews[0].rating).toBe(5);
    expect(response.body.reviews[0].comment).toBe("Excellent service");
  });

  test("should return empty reviews", async () => {
    const response = await request(app).get(
      `/api/reviews/service/${serviceId}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(0);
    expect(response.body.reviews).toEqual([]);
  });

  test("should reject invalid service ObjectId", async () => {
    const response = await request(app).get("/api/reviews/service/invalid-id");

    expect(response.statusCode).toBe(400);
  });

  test("should return empty array for non-existing service", async () => {
    const response = await request(app).get(
      `/api/reviews/service/${new mongoose.Types.ObjectId()}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(0);
    expect(response.body.reviews).toEqual([]);
  });
});
