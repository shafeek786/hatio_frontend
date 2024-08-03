import React, { useEffect, useState } from "react";
import { getProjects } from "../api/api";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects();
        setProjects(data.projects);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project._id}
            className="border border-gray-300 rounded-lg p-4 shadow-md"
          >
            <Link
              to={`/projects/${project._id}`}
              className="text-blue-600 hover:underline"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
