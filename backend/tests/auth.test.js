const request = require("supertest");
const app = require("../app");

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "user",
      });

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.user).toBeDefined();

      expect(response.body.user.email).toBe("john@example.com");
    });

    test("should not register a user with duplicate email", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "user",
      };

      await request(app).post("/api/auth/register").send(user);

      const response = await request(app).post("/api/auth/register").send(user);

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject registration without email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        password: "123456",
        role: "user",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject registration without password", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login successfully", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "user",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "123456",
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.token).toBeDefined();
    });

    test("should reject incorrect password", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "user",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject unknown email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "unknown@example.com",
        password: "123456",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject login without email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "123456",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should reject login without password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    test("should return logged in user's profile", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "user",
      });

      const login = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "123456",
      });

      const token = login.body.token;

      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.user).toBeDefined();
    });

    test("should reject profile request without token", async () => {
      const response = await request(app).get("/api/auth/profile");

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject invalid JWT token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid.jwt.token");

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/admin", () => {
    test("should reject normal user", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John",
        email: "john@example.com",
        password: "123456",
        role: "user",
      });

      const login = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "123456",
      });

      const response = await request(app)
        .get("/api/auth/admin")
        .set("Authorization", `Bearer ${login.body.token}`);

      expect(response.statusCode).toBe(403);

      expect(response.body.success).toBe(false);
    });
  });
});
