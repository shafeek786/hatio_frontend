import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");
console.log(localStorage.getItem("token"));

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
export const register = (user) => api.post("/users/register", user);
export const login = (user) => api.post("/auth/login", user);
export const createProject = (userId, title) => {
  api.post(`/projects/${userId}`, { title });
};

export const getProjects = (userId) => {
  const response = api.get(`/projects/${userId}`);
  return response;
};
export const removeProject = (id) =>
  api.delete(`/projects/deleteproject/${id}`);
export const updateProject = (projectId, title) =>
  api.put(`/projects/updateproject/${projectId}`, title);
export const getProjectById = (id) => api.get(`/projects/projectsbyid/${id}`);
export const addTodoToProject = (projectId, todo) =>
  api.post(`/projects/${projectId}/todos`, todo);
export const updateTodoStatus = (todoId, status) =>
  api.put(`/projects/todos/${todoId}`, { status });
export const updateTodos = (todoId, updateData) =>
  api.put(`/projects/update/${todoId}`, updateData);
export const deleteTodo = (todoId) => api.delete(`/projects/todos/${todoId}`);
export const exportProjectSummary = (projectId) =>
  api.get(`/projects/${projectId}/export`);
