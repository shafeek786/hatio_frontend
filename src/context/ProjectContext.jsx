import React, { createContext, useCallback, useContext, useState } from "react";
import {
  getProjectById,
  addTodoToProject,
  updateTodoStatus,
  deleteTodo,
  exportProjectSummary,
  getProjects,
  removeProject,
} from "../api/api";

// Create a context for managing project-related state and actions
const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // State to hold the current project and the list of projects
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  // Function to fetch all projects, with userId as a parameter
  const fetchProjects = useCallback(async (userId) => {
    try {
      const { data } = await getProjects(userId);
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  // Function to remove a project by its ID
  const removeProjectById = async (id) => {
    try {
      const { data } = await removeProject(id);
      // Optionally update the projects list after removal
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch a project by its ID
  const fetchProjectById = async (id) => {
    try {
      const { data } = await getProjectById(id);
      setCurrentProject(data.project);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add a new todo item to a project
  const addTodo = async (projectId, { name, description }) => {
    try {
      const { data } = await addTodoToProject(projectId, { name, description });
      setCurrentProject((prevProject) => ({
        ...prevProject,
        todos: [...prevProject.todos, data.todo],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to update the status of a todo item
  const updateTodo = async (todoId, status) => {
    try {
      await updateTodoStatus(todoId, status);
      setCurrentProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.map((todo) =>
          todo._id === todoId ? { ...todo, status } : todo
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to remove a todo item from the project
  const removeTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setCurrentProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.filter((todo) => todo._id !== todoId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to export the project summary
  const exportSummary = async (projectId) => {
    try {
      const { data } = await exportProjectSummary(projectId);
      window.open(data.gistUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  // Provide the context values to children components
  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        fetchProjectById,
        addTodo,
        updateTodo,
        removeTodo,
        exportSummary,
        fetchProjects,
        projects,
        removeProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProjects = () => useContext(ProjectContext);
