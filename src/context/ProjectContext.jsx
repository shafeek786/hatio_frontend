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

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const fetchProjects = useCallback(async (userId) => {
    try {
      const { data } = await getProjects(userId);
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  const removeProjectById = async (id) => {
    try {
      const { data } = await removeProject(id);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProjectById = async (id) => {
    try {
      const { data } = await getProjectById(id);
      setCurrentProject(data.project);
    } catch (error) {
      console.error(error);
    }
  };

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

  const exportSummary = async (projectId) => {
    try {
      const { data } = await exportProjectSummary(projectId);
      window.open(data.gistUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

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

export const useProjects = () => useContext(ProjectContext);
