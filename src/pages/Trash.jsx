import React, { useEffect } from "react";
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";

const Trash = () => {
  const { userId } = useAuth();
  const { deletedProject, getDeletedProject } = useProjects();

  useEffect(() => {
    getDeletedProject(userId);
  }, [userId, getDeletedProject]);

  //   const deletedProjects = projects.filter((project) => !project.isDeleted);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Deleted Projects</h1>
      {deletedProject.length > 0 ? (
        <ul className="space-y-4">
          {deletedProject.map((project) => (
            <li
              key={project._id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-100"
            >
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No deleted projects found.</p>
      )}
    </div>
  );
};

export default Trash;
