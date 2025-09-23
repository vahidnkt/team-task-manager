import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleManageUsers = () => {
    navigate(ROUTES.USERS);
  };

  const handleManageProjects = () => {
    navigate(ROUTES.PROJECTS);
  };

  const handleManageTasks = () => {
    navigate(ROUTES.TASKS);
  };

  const handleCreateProject = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  const handleCreateTask = () => {
    navigate(ROUTES.CREATE_TASK);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.username}! System overview and management tools
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
          <Button onClick={handleCreateTask}>
            Create Task
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">25</p>
              <p className="text-sm text-gray-500">Active users in system</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-500">Active projects</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-yellow-600">45</p>
              <p className="text-sm text-gray-500">Tasks created</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-purple-600">62%</p>
              <p className="text-sm text-gray-500">Task completion</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              User Management
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage system users and permissions
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Button
                type="primary"
                className="w-full"
                onClick={handleManageUsers}
              >
                View All Users
              </Button>
              <Button  className="w-full">
                User Activity Report
              </Button>
              <Button  className="w-full">
                Export User Data
              </Button>
            </div>
          </div>
        </div>

        {/* Project Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Project Management
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage all projects in the system
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Button
                type="primary"
                className="w-full"
                onClick={handleManageProjects}
              >
                View All Projects
              </Button>
              <Button  className="w-full">
                Project Analytics
              </Button>
              <Button  className="w-full">
                Export Project Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Task Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage all tasks across the system
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button type="primary" onClick={handleManageTasks}>
              View All Tasks
            </Button>
            <Button >Task Analytics</Button>
            <Button >Export Task Data</Button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            System Information
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            System status and health metrics
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.2GB</div>
              <div className="text-sm text-gray-600">Database Size</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent System Activity
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Latest activities across the system
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New user "alice.brown@example.com" registered
                </p>
                <p className="text-xs text-gray-500">
                  1 hour ago • User Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Project "Mobile App" was completed
                </p>
                <p className="text-xs text-gray-500">
                  3 hours ago • Project Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  System backup completed successfully
                </p>
                <p className="text-xs text-gray-500">6 hours ago • System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Task "Security audit" was assigned to Mike Johnson
                </p>
                <p className="text-xs text-gray-500">
                  8 hours ago • Task Management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
