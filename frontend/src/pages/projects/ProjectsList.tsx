import React from "react";
import { Button } from "antd";

const ProjectsList: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button type="primary">Create New Project</Button>
      </div>
      <p className="text-gray-600">Projects list page - Coming soon!</p>
    </div>
  );
};

export default ProjectsList;
