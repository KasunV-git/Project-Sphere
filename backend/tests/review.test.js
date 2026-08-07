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

describe("PUT /api/reviews/:id", () => {
  test("user should update own review", async () => {
    const createResponse = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const reviewId = createResponse.body.review._id;

    const response = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
        comment: "Very good service",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.review.rating).toBe(4);
    expect(response.body.review.comment).toBe("Very good service");
  });

  test("should reject request without token", async () => {
    const createResponse = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const reviewId = createResponse.body.review._id;

    const response = await request(app).put(`/api/reviews/${reviewId}`).send({
      rating: 4,
    });

    expect(response.statusCode).toBe(401);
  });

  test("should reject updating another user's review", async () => {
    const createResponse = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const reviewId = createResponse.body.review._id;

    await request(app).post("/api/auth/register").send({
      name: "Other User",
      email: "other@test.com",
      password: "123456",
      role: "user",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "other@test.com",
      password: "123456",
    });

    const otherToken = login.body.token;

    const response = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        rating: 3,
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  test("should return 404 when review not found", async () => {
    const response = await request(app)
      .put(`/api/reviews/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Review not found");
  });

  test("should reject invalid review ObjectId", async () => {
    const response = await request(app)
      .put("/api/reviews/invalid-id")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
      });

    expect(response.statusCode).toBe(400);
  });

  test("should reject invalid rating", async () => {
    const createResponse = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const reviewId = createResponse.body.review._id;

    const response = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 10,
      });

    expect(response.statusCode).toBe(400);
  });
});

describe("DELETE /api/reviews/:id", () => {
  test("user should delete own review", async () => {
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    const response = await request(app)
      .delete(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Review deleted");
  });

  test("admin should delete any review", async () => {
    // User creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Admin deletes the user's review
    const response = await request(app)
      .delete(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Review deleted");
  });

  test("should reject request without token", async () => {
    // User creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Try deleting without a token
    const response = await request(app).delete(
      `/api/reviews/${review.body.review._id}`,
    );

    expect(response.statusCode).toBe(401);
  });

  test("should reject deleting another user's review", async () => {
    // User creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Register another user
    await request(app).post("/api/auth/register").send({
      name: "User2",
      email: "user2@test.com",
      password: "123456",
      role: "user",
    });

    // Login as the second user
    const user2Login = await request(app).post("/api/auth/login").send({
      email: "user2@test.com",
      password: "123456",
    });

    const user2Token = user2Login.body.token;

    // User2 tries to delete User1's review
    const response = await request(app)
      .delete(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${user2Token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Access denied");
  });

  test("should return 404 when review not found", async () => {
    const response = await request(app)
      .delete(`/api/reviews/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Review not found");
  });

  test("should reject invalid review ObjectId", async () => {
    const response = await request(app)
      .delete("/api/reviews/invalid-id")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /api/reviews/:id", () => {
  test("user should update own review", async () => {
    // Create a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Update the review
    const response = await request(app)
      .put(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
        comment: "Updated review",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.review.rating).toBe(4);
    expect(response.body.review.comment).toBe("Updated review");
  });

  test("admin should update any review", async () => {
    // User creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Admin updates the user's review
    const response = await request(app)
      .put(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        rating: 3,
        comment: "Updated by admin",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.review.rating).toBe(3);
    expect(response.body.review.comment).toBe("Updated by admin");
  });

  test("should reject request without token", async () => {
    // User creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Try updating without authentication
    const response = await request(app)
      .put(`/api/reviews/${review.body.review._id}`)
      .send({
        rating: 4,
        comment: "Updated review",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should reject updating another user's review", async () => {
    // User1 creates a review
    const review = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        service: serviceId,
        rating: 5,
        comment: "Excellent service",
      });

    // Register another user
    await request(app).post("/api/auth/register").send({
      name: "User2",
      email: "user2@test.com",
      password: "123456",
      role: "user",
    });

    // Login as User2
    const user2Login = await request(app).post("/api/auth/login").send({
      email: "user2@test.com",
      password: "123456",
    });

    const user2Token = user2Login.body.token;

    // User2 tries to update User1's review
    const response = await request(app)
      .put(`/api/reviews/${review.body.review._id}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        rating: 2,
        comment: "Trying to edit someone else's review",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Access denied");
  });

  test("should return 404 when review not found", async () => {
    const response = await request(app)
      .put(`/api/reviews/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
        comment: "Updated review",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Review not found");
  });

  test("should reject invalid review ObjectId", async () => {
    const response = await request(app)
      .put("/api/reviews/invalid-id")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 4,
        comment: "Updated review",
      });

    expect(response.statusCode).toBe(400);
  });
});
