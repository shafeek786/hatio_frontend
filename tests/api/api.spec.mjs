import { test, expect } from "@playwright/test";
import axios from "axios";
import jwt from "jsonwebtoken";

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
let userId = null;

// Function to decode JWT and extract user ID
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.decode(token); // Decode without verification
    console.log("Decoded Token:", decoded);
    return decoded.id; // Adjust this based on the actual structure of your JWT
  } catch (error) {
    console.error(`Error decoding token: ${error.message}`);
    throw error;
  }
};

test.beforeAll(async () => {
  const user = generateUniqueUser();

  try {
    await api.post("/users/register", user);

    const loginResponse = await api.post("/auth/login", {
      email: user.email,
      password: user.password,
    });

    authToken = loginResponse.data.access_token;
    userEmail = user.email;
    userId = getUserIdFromToken(authToken); // Decode token to get user ID
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

// Project Creation
test.describe("Project Creation", () => {
  test("should create a new project successfully", async () => {
    if (!authToken || !userId) {
      throw new Error(
        "No auth token or user ID available. Ensure login test has run successfully."
      );
    }

    const projectTitle = { title: "New Project" }; // Correct structure

    try {
      const createProjectResponse = await api.post(
        `/projects/${userId}`,
        projectTitle,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(
        `Create Project Status Code: ${createProjectResponse.status}`
      );
      console.log(
        `Create Project Response Data: ${JSON.stringify(
          createProjectResponse.data,
          null,
          2
        )}`
      );

      expect(createProjectResponse.status).toBe(201);
      expect(createProjectResponse.data).toHaveProperty(
        "project.title",
        projectTitle.title
      ); // Check title within project object
    } catch (error) {
      if (error.response) {
        console.log(`Error Status Code: ${error.response.status}`);
        console.log(
          `Error Response Data: ${JSON.stringify(error.response.data, null, 2)}`
        );
      } else {
        console.error(`Error: ${error.message}`);
      }
      throw error;
    }
  });
});

// Project Retrieval
test.describe("Project Retrieval", () => {
  test("should retrieve the list of projects successfully", async () => {
    if (!authToken || !userId) {
      throw new Error(
        "No auth token or user ID available. Ensure login test has run successfully."
      );
    }

    try {
      console.log(
        `Making request to /projects/${userId} with token ${authToken}`
      );

      const getProjectsResponse = await api.get(`/projects/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(getProjectsResponse.status).toBe(200);
      expect(Array.isArray(getProjectsResponse.data.projects)).toBe(true); // Check if response is an array
    } catch (error) {
      if (error.response) {
        console.log(`Error Status Code: ${error.response.status}`);
        console.log(
          `Error Response Data: ${JSON.stringify(error.response.data, null, 2)}`
        );
      } else {
        console.error(`Error: ${error.message}`);
      }
      throw error;
    }
  });

  // Project Deletion
  test.describe("Project Deletion", () => {
    test("should delete a project successfully", async () => {
      const projectId = "66af18e966fec5ac1a1d30e5"; // replace with your project id

      if (!authToken) {
        throw new Error(
          "No auth token. Ensure login test has run successfully."
        );
      }

      try {
        const deleteProjectResponse = await api.delete(
          `/projects/deleteproject/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        expect(deleteProjectResponse.status).toBe(200);
        expect(Array.isArray(deleteProjectResponse.data.projects)).toBe(true);
      } catch (error) {
        if (error.response) {
          console.log(`Error Status Code: ${error.response.status}`);
          console.log(
            `Error Response Data: ${JSON.stringify(
              error.response.data,
              null,
              2
            )}`
          );
        } else {
          console.error(`Error: ${error.message}`);
        }
        throw error;
      }
    });
  });

  // Project Update
  test.describe("Project Update", () => {
    test("should update project successfully", async () => {
      const projectId = "66af1dc8d95abc55ba5ccfa9"; // replace with your project id

      if (!authToken) {
        throw new Error(
          "No auth token. Ensure login test has run successfully."
        );
      }

      const updatedTitle = { title: "updated Project" }; // Correct structure

      try {
        const createProjectResponse = await api.post(
          `/projects/${projectId}`,
          updatedTitle,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        expect(createProjectResponse.status).toBe(201);
      } catch (error) {
        if (error.response) {
          console.log(`Error Status Code: ${error.response.status}`);
          console.log(
            `Error Response Data: ${JSON.stringify(
              error.response.data,
              null,
              2
            )}`
          );
        } else {
          console.error(`Error: ${error.message}`);
        }
        throw error;
      }
    });
  });
});

// To run only the update project test
test.describe("Run Single Test", () => {
  test("should update project successfully", async () => {
    const projectId = "66af1dc8d95abc55ba5ccfa9"; // replace with your project id

    if (!authToken) {
      throw new Error("No auth token. Ensure login test has run successfully.");
    }

    const updatedTitle = { title: "updated Project" }; // Correct structure

    try {
      const createProjectResponse = await api.post(
        `/projects/${projectId}`,
        updatedTitle,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(createProjectResponse.status).toBe(201);
    } catch (error) {
      if (error.response) {
        console.log(`Error Status Code: ${error.response.status}`);
        console.log(
          `Error Response Data: ${JSON.stringify(error.response.data, null, 2)}`
        );
      } else {
        console.error(`Error: ${error.message}`);
      }
      throw error;
    }
  });
});
