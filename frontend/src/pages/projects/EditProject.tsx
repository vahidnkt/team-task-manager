import React from "react";
import { useParams } from "react-router-dom";

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Project</h1>
      <p className="text-gray-600">Project ID: {id}</p>
      <p className="text-gray-600 mt-2">Edit project page - Coming soon!</p>
    </div>
  );
};

export default EditProject;
