import React from "react";
import ProjectDetail from "../components/ProjectDetail";

const ProjectPage = ({ match }) => (
  <div>
    <h1 className="text-3xl font-bold text-center mt-8">Project Details</h1>
    <ProjectDetail match={match} />
  </div>
);

export default ProjectPage;
