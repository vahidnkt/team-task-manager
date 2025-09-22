import React from "react";
import { useParams } from "react-router-dom";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">User Detail</h1>
      <p className="text-gray-600">User ID: {id}</p>
      <p className="text-gray-600 mt-2">User detail page - Coming soon!</p>
    </div>
  );
};

export default UserDetail;
