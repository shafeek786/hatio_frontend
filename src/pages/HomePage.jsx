import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProject, updateProject } from "../api/api";
import { useProjects } from "../context/ProjectContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { projects, fetchProjects, removeProjectById } = useProjects();
  const { userId } = useAuth();

  useEffect(() => {
    fetchProjects(userId);
  }, [fetchProjects, userId]);

  const handleCreateProject = async () => {
    try {
      console.log(newProjectTitle);
      await createProject(userId, newProjectTitle);
      setNewProjectTitle("");
      fetchProjects(userId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (projectId, currentTitle) => {
    setEditingProjectId(projectId);
    setEditTitle(currentTitle);
  };

  const handleUpdateProject = async (projectId) => {
    try {
      await updateProject(projectId, { title: editTitle });
      setEditingProjectId(null);
      setEditTitle("");
      fetchProjects(userId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditTitle("");
  };

  const handleDeleteProject = async (id) => {
    await removeProjectById(id);
    fetchProjects(userId);
    toast.success("Project deleted successfully");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Todo Projects</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="New project title"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <button
          onClick={handleCreateProject}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Project
        </button>
        {/* Trash Button */}
        <Link
          to="/trash"
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trash
        </Link>
      </div>
      <ul className="space-y-4">
        {projects &&
          projects.map((project) => (
            <li
              key={project._id}
              className="border border-gray-300 rounded-lg p-4 shadow-md"
            >
              {editingProjectId === project._id ? (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-gray-300 rounded p-2"
                    />
                    <button
                      onClick={() => handleUpdateProject(project._id)}
                      className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-xl font-semibold"
                    >
                      {project.title}
                    </Link>
                    <span className="text-gray-600">
                      {new Date(project.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleEditClick(project._id, project.title)
                      }
                      className="py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default HomePage;
