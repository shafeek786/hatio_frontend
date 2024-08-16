import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Function to get the token from local storage
const getToken = () => localStorage.getItem("token");
console.log(localStorage.getItem("token"));

// Create an Axios instance with a base URL and default headers
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to add the Authorization header if the token exists
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Registers a new user.
 * @param {Object} user - The user details for registration.
 * @returns {Promise} Axios promise for the registration request.
 */
export const register = (user) => {
  return api.post("/users/register", user);
};

/**
 * Logs in a user.
 * @param {Object} user - The user details for login.
 * @returns {Promise} Axios promise for the login request.
 */
export const login = (user) => {
  return api.post("/auth/login", user);
};

/**
 * Creates a new project.
 * @param {string} userId - The ID of the user creating the project.
 * @param {string} title - The title of the new project.
 * @returns {Promise} Axios promise for the project creation request.
 */
export const createProject = (userId, title) => {
  return api.post(`/projects/${userId}`, { title });
};

/**
 * Retrieves the list of projects for a user.
 * @param {string} userId - The ID of the user whose projects are being retrieved.
 * @returns {Promise} Axios promise for the projects retrieval request.
 */
export const getProjects = (userId) => {
  return api.get(`/projects/${userId}`);
};

export const getDeletedProjects = (userId) => {
  return api.get(`/projects/deleted/${userId}`);
};

export const getDeletedproject = (userId) => {
  return api.get(`/projects/get_deleted_project/${userId}`);
};
// export const getDeletedTodo = { userId } => {
//   return  api.get(`/projects/get_deleted/${userId}`)
// }
/**
 * Removes a project.
 * @param {string} id - The ID of the project to be removed.
 * @returns {Promise} Axios promise for the project removal request.
 */
export const removeProject = (id) => {
  return api.delete(`/projects/deleteproject/${id}`);
};

/**
 * Updates an existing project.
 * @param {string} projectId - The ID of the project to be updated.
 * @param {Object} title - The updated title of the project.
 * @returns {Promise} Axios promise for the project update request.
 */
export const updateProject = (projectId, title) => {
  return api.put(`/projects/updateproject/${projectId}`, title);
};

/**
 * Retrieves a project by its ID.
 * @param {string} id - The ID of the project to be retrieved.
 * @returns {Promise} Axios promise for the project retrieval request.
 */
export const getProjectById = (id) => {
  return api.get(`/projects/projectsbyid/${id}`);
};

/**
 * Adds a new todo item to a project.
 * @param {string} projectId - The ID of the project to add the todo to.
 * @param {Object} todo - The todo item to be added.
 * @returns {Promise} Axios promise for the todo addition request.
 */
export const addTodoToProject = (projectId, todo) => {
  return api.post(`/projects/${projectId}/todos`, todo);
};

/**
 * Updates the status of a todo item.
 * @param {string} todoId - The ID of the todo item to be updated.
 * @param {string} status - The new status of the todo item.
 * @returns {Promise} Axios promise for the todo status update request.
 */
export const updateTodoStatus = (todoId, status) => {
  return api.put(`/projects/todos/${todoId}`, { status });
};

/**
 * Updates a todo item with new data.
 * @param {string} todoId - The ID of the todo item to be updated.
 * @param {Object} updateData - The new data for the todo item.
 * @returns {Promise} Axios promise for the todo update request.
 */
export const updateTodos = (todoId, updateData) => {
  return api.put(`/projects/update/${todoId}`, updateData);
};

/**
 * Deletes a todo item.
 * @param {string} todoId - The ID of the todo item to be deleted.
 * @returns {Promise} Axios promise for the todo deletion request.
 */
export const deleteTodo = (todoId) => {
  return api.delete(`/projects/todos/${todoId}`);
};

/**
 * Exports the summary of a project.
 * @param {string} projectId - The ID of the project to export the summary for.
 * @returns {Promise} Axios promise for the project summary export request.
 */
export const exportProjectSummary = (projectId) => {
  return api.get(`/projects/${projectId}/export`);
};
