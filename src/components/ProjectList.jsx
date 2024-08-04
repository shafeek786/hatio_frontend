import React, { useEffect, useState } from "react";
import { getProjects } from "../api/api";
import { Link } from "react-router-dom";

const ProjectList = () => {
  // State to hold the list of projects
  const [projects, setProjects] = useState([]);

  // Fetch projects from the API on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Call the API to get the projects
        const { data } = await getProjects();
        // Update the state with the fetched projects
        setProjects(data.projects);
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error(error);
      }
    };
    // Call the fetch function
    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* Heading for the projects list */}
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      {/* List of projects */}
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project._id}
            className="border border-gray-300 rounded-lg p-4 shadow-md"
          >
            {/* Link to individual project details */}
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
