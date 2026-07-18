const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

let adminToken;
let userToken;

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
});

describe("Category API", () => {
  describe("POST /api/categories", () => {
    test("admin should create a category", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Utilities",
          description: "Utility tools",
          icon: "tool.png",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.category).toBeDefined();
      expect(response.body.category.name).toBe("Utilities");
    });

    test("normal user should not create category", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Utilities",
          description: "Utility tools",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test("should reject request without token", async () => {
      const response = await request(app).post("/api/categories").send({
        name: "Utilities",
        description: "Utility tools",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/categories", () => {
    let categoryId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Utilities",
          description: "Utility tools",
          icon: "tool.png",
        });

      categoryId = response.body.category._id;
    });

    test("should get all categories", async () => {
      const response = await request(app).get("/api/categories");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);
    });

    test("should get category by id", async () => {
      const response = await request(app).get(`/api/categories/${categoryId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.category._id).toBe(categoryId);
    });

    test("should return 404 for non-existing category", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/categories/${fakeId}`);

      expect(response.statusCode).toBe(404);
    });

    test("should reject invalid ObjectId", async () => {
      const response = await request(app).get("/api/categories/invalid-id");

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/categories/:id", () => {
    let categoryId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Utilities",
          description: "Utility tools",
          icon: "tool.png",
        });

      categoryId = response.body.category._id;
    });

    test("admin should update category", async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Academic Tools",
          description: "Updated description",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.category.name).toBe("Academic Tools");
    });

    test("normal user should not update category", async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Hack",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test("should reject update without token", async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({
          name: "Hack",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("should return 404 for non-existing category", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/categories/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated",
        });

      expect(response.statusCode).toBe(404);
    });

    test("should reject invalid ObjectId", async () => {
      const response = await request(app)
        .put("/api/categories/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
