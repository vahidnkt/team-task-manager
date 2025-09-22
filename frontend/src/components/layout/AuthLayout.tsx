import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Add a header or branding for auth pages */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <div className="text-sm text-gray-500">Secure Authentication</div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main>
        <Outlet />
      </main>

      {/* Optional: Add footer for auth pages */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 Task Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
