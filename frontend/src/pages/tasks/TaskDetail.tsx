import React from "react";
import { useParams } from "react-router-dom";

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Detail</h1>
      <p className="text-gray-600">Task ID: {id}</p>
      <p className="text-gray-600 mt-2">Task detail page - Coming soon!</p>
    </div>
  );
};

export default TaskDetail;
