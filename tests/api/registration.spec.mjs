import { test, expect } from "@playwright/test";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const generateUniqueUser = () => {
  const uniqueId = Date.now();
  return {
    name: `testuser${uniqueId}`,
    email: `testuser${uniqueId}@example.com`,
    mobile: `12345678${Math.floor(Math.random() * 100)}`,
    password: "password123",
  };
};

let authToken = null;
let userEmail = null;

test.describe("User Registration and Login", () => {
  test("should register a new user successfully", async () => {
    const user = generateUniqueUser();
    try {
      const response = await api.post("/users/register", user);
      console.log(`Register Status Code: ${response.status}`);
      console.log(`Register Response Data: ${JSON.stringify(response.data)}`);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("success", true);
      expect(response.data).toHaveProperty(
        "message",
        "User registered successfully"
      );
    } catch (error) {
      if (error.response) {
        console.log(`Error Status Code: ${error.response.status}`);
        console.log(
          `Error Response Data: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.error(`Error: ${error.message}`);
      }
      throw error;
    }
  });

  test("should login the registered user successfully", async () => {
    const user = generateUniqueUser();
    userEmail = user.email;

    try {
      await api.post("/users/register", user);

      const loginResponse = await api.post("/auth/login", {
        email: user.email,
        password: user.password,
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.data).toHaveProperty("access_token");

      authToken = loginResponse.data.access_token;
      console.log(`Login Status Code: ${loginResponse.status}`);
      console.log(`Login Response Data: ${JSON.stringify(loginResponse.data)}`);
    } catch (error) {
      if (error.response) {
        console.log(`Error Status Code: ${error.response.status}`);
        console.log(
          `Error Response Data: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.error(`Error: ${error.message}`);
      }
      throw error;
    }
  });
});
