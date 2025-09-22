import React from "react";
import { useParams } from "react-router-dom";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Detail</h1>
      <p className="text-gray-600">Project ID: {id}</p>
      <p className="text-gray-600 mt-2">Project detail page - Coming soon!</p>
    </div>
  );
};

export default ProjectDetail;
