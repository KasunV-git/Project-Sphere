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
    
  });
});
