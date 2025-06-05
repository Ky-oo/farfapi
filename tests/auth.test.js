import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { User } from "../model";
import app from "../app";
beforeAll(async () => {
  await User.destroy({ where: {} });
});

describe("Auth", () => {
  it("should return a 401 error if the user is not authenticated", async () => {
    const response = await request(app).get("/auth/me");
    expect(response.status).toBe(401);
  });
});

describe("signup", () => {
  it("should return a 400 error if the required fields are missing", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "test@test.com",
      password: "password",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Email, password, firstname, lastname, gender and city are required"
    );
  });

  it("should return a 400 error if the email already exists", async () => {
    await User.create({
      email: "test@test.com",
      password: "password",
      firstname: "Test",
      lastname: "User",
      gender: "male",
      city: "Test City",
    });

    const response = await request(app).post("/auth/signup").send({
      email: "test@test.com",
      password: "password",
      firstname: "Test",
      lastname: "User",
      gender: "male",
      city: "Test City",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email already exists");
  });
});

describe("login", () => {
  it("should return a 400 error if the required fields are missing", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@test.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email and password are required");
  });

  it("should return a 404 error if the email does not exist", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testunknown@test.com",
      password: "passwordfake",
    });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("should return a 404 error if the password is incorrect", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("should return a 200 error if the login is successful", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "password",
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
