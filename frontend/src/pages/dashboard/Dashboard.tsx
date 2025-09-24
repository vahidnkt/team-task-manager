import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";
import { formatRelativeTime } from "../../utils/dateUtils";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PriorityBadge } from "../../components/ui/PriorityBadge";

// Static data for demonstration - will be replaced with real API calls
const USER_DASHBOARD_DATA = {
  stats: {
    totalTasks: 12,
    completedTasks: 8,
    inProgressTasks: 3,
    overdueTasks: 1,
    totalProjects: 5,
    activeProjects: 4,
    completedProjects: 1,
  },
  recentTasks: [
    {
      id: "1",
      title: "Fix login bug",
      description: "Users unable to login with special characters in password",
      status: "done" as const,
      priority: "high" as const,
      dueDate: "2024-01-15",
      projectId: "proj-1",
      projectName: "Mobile App",
      assigneeId: "user-1",
      assigneeName: "John Doe",
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "2",
      title: "Update documentation",
      description: "Update API documentation for new endpoints",
      status: "in_progress" as const,
      priority: "medium" as const,
      dueDate: "2024-01-20",
      projectId: "proj-2",
      projectName: "Web Platform",
      assigneeId: "user-1",
      assigneeName: "John Doe",
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      id: "3",
      title: "Design new UI components",
      description: "Create design system for consistent UI",
      status: "todo" as const,
      priority: "medium" as const,
      dueDate: "2024-01-25",
      projectId: "proj-1",
      projectName: "Mobile App",
      assigneeId: "user-1",
      assigneeName: "John Doe",
      createdAt: "2024-01-14T09:15:00Z",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Mobile App",
      description: "iOS and Android mobile application",
      taskCount: 15,
      completedTaskCount: 10,
      progressPercentage: 67,
      createdBy: "user-1",
      creatorName: "John Doe",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-14T10:30:00Z",
    },
    {
      id: "proj-2",
      name: "Web Platform",
      description: "Web-based task management platform",
      taskCount: 8,
      completedTaskCount: 5,
      progressPercentage: 63,
      createdBy: "user-1",
      creatorName: "John Doe",
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-13T15:20:00Z",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      action: "task_completed",
      description: "Completed task 'Fix login bug'",
      userId: "user-1",
      userName: "John Doe",
      projectId: "proj-1",
      projectName: "Mobile App",
      taskId: "1",
      taskTitle: "Fix login bug",
      createdAt: "2024-01-14T14:30:00Z",
    },
    {
      id: "act-2",
      action: "task_created",
      description: "Created new task 'Design new UI components'",
      userId: "user-1",
      userName: "John Doe",
      projectId: "proj-1",
      projectName: "Mobile App",
      taskId: "3",
      taskTitle: "Design new UI components",
      createdAt: "2024-01-14T09:15:00Z",
    },
  ],
};

const ADMIN_DASHBOARD_DATA = {
  stats: {
    totalTasks: 45,
    completedTasks: 28,
    inProgressTasks: 12,
    overdueTasks: 5,
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalUsers: 25,
    activeUsers: 23,
  },
  recentTasks: [
    {
      id: "5",
      title: "System maintenance",
      description: "Regular system maintenance and updates",
      status: "in_progress" as const,
      priority: "high" as const,
      dueDate: "2024-01-16",
      projectId: "proj-4",
      projectName: "System Operations",
      assigneeId: "user-2",
      assigneeName: "Jane Smith",
      createdAt: "2024-01-14T08:00:00Z",
    },
    {
      id: "6",
      title: "Security audit",
      description: "Conduct security audit of all systems",
      status: "todo" as const,
      priority: "high" as const,
      dueDate: "2024-01-22",
      projectId: "proj-5",
      projectName: "Security",
      assigneeId: "user-3",
      assigneeName: "Mike Johnson",
      createdAt: "2024-01-13T16:00:00Z",
    },
  ],
  recentActivities: [
    {
      id: "act-4",
      action: "user_created",
      description: "New user 'Alice Brown' registered",
      userId: "user-5",
      userName: "Alice Brown",
      createdAt: "2024-01-14T16:45:00Z",
    },
    {
      id: "act-5",
      action: "project_created",
      description: "Created new project 'Mobile App'",
      userId: "user-1",
      userName: "John Doe",
      projectId: "proj-1",
      projectName: "Mobile App",
      createdAt: "2024-01-14T10:00:00Z",
    },
    {
      id: "act-6",
      action: "task_assigned",
      description: "Assigned task 'System maintenance' to Jane Smith",
      userId: "user-2",
      userName: "Jane Smith",
      projectId: "proj-4",
      projectName: "System Operations",
      taskId: "5",
      taskTitle: "System maintenance",
      createdAt: "2024-01-14T08:00:00Z",
    },
  ],
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Get role-based dashboard data
  const dashboardData = isAdmin() ? ADMIN_DASHBOARD_DATA : USER_DASHBOARD_DATA;

  const handleCreateTask = () => {
    navigate(ROUTES.CREATE_TASK);
  };

  const handleViewTasks = () => {
    navigate(ROUTES.TASKS);
  };

  const handleCreateProject = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  const handleViewProjects = () => {
    navigate(ROUTES.PROJECTS);
  };

  const handleViewUsers = () => {
    navigate(ROUTES.USERS);
  };

  return (
    <>
      {/* Animated background with floating orbs */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header Section */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            {/* Welcome Text */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Hi {user?.username || "User"}! 👋
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                {isAdmin()
                  ? "Admin Dashboard - Manage your entire system"
                  : "Your personal task management hub"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleCreateTask}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ✨ Create Task
              </button>
              {isAdmin() && (
                <Button
                  type="default"
                  onClick={handleCreateProject}
                  size="large"
                  className="h-10 sm:h-12 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200"
                >
                  📁 Create Project
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Stats Cards */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              📊 Overview
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Total Tasks
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.totalTasks}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      {isAdmin()
                        ? "All tasks in system"
                        : "Tasks assigned to you"}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600">
                    <span className="text-lg sm:text-xl lg:text-2xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Completed
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.completedTasks}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      Finished tasks
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-600">
                    <span className="text-lg sm:text-xl lg:text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      In Progress
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.inProgressTasks}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      Active tasks
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-yellow-50 text-yellow-600">
                    <span className="text-lg sm:text-xl lg:text-2xl">🔄</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Overdue
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.overdueTasks}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      Past due date
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-red-50 text-red-600">
                    <span className="text-lg sm:text-xl lg:text-2xl">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin-specific stats */}
          {isAdmin() && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                🔧 Admin Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Total Projects
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {dashboardData.stats.totalProjects}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                        All projects in system
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-purple-50 text-purple-600">
                      <span className="text-lg sm:text-xl lg:text-2xl">📁</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Active Projects
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {dashboardData.stats.activeProjects}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                        Currently running
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600">
                      <span className="text-lg sm:text-xl lg:text-2xl">🚀</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Total Users
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        25
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                        Registered users
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-orange-50 text-orange-600">
                      <span className="text-lg sm:text-xl lg:text-2xl">👥</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User-specific project stats */}
          {!isAdmin() && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                📂 My Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        My Projects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardData.stats.totalProjects}
                      </p>
                      <p className="text-sm text-gray-500">
                        Projects you're involved in
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                      <span className="text-2xl">📁</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Active Projects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardData.stats.activeProjects}
                      </p>
                      <p className="text-sm text-gray-500">Currently working</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                      <span className="text-2xl">🚀</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg sm:rounded-xl border border-white/30 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Completed Projects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardData.stats.completedProjects}
                      </p>
                      <p className="text-sm text-gray-500">Finished projects</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                      <span className="text-2xl">🎉</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Tasks and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tasks */}
            <div className="glass-card rounded-xl border border-white/30">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📝 {isAdmin() ? "Recent Tasks" : "My Recent Tasks"}
                  </h3>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleViewTasks}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View All →
                  </Button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 sm:p-4 border border-white/30 rounded-lg hover:bg-white/50 cursor-pointer transition-colors backdrop-blur-sm"
                      onClick={() => navigate(ROUTES.TASK_DETAIL(task.id))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                            {task.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {task.projectName}
                          </p>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1 sm:space-y-2 ml-2 sm:ml-4">
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                      {task.dueDate && (
                        <div className="mt-3 text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                  {dashboardData.recentTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📋</div>
                      <p>No recent tasks</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
              <div className="p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  ⚡ {isAdmin() ? "System Activities" : "My Activities"}
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          {
                            task_completed: "bg-green-100 text-green-600",
                            task_created: "bg-blue-100 text-blue-600",
                            project_created: "bg-purple-100 text-purple-600",
                            user_created: "bg-orange-100 text-orange-600",
                            task_assigned: "bg-indigo-100 text-indigo-600",
                          }[activity.action] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="text-sm">
                          {{
                            task_completed: "✅",
                            task_created: "➕",
                            project_created: "📁",
                            user_created: "👤",
                            task_assigned: "👥",
                          }[activity.action] || "📝"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-900">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {activity.userName}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dashboardData.recentActivities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">⚡</div>
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Projects Overview */}
          {!isAdmin() && "projects" in dashboardData && (
            <div className="glass-card rounded-xl border border-white/30">
              <div className="p-4 sm:p-6 border-b border-white/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    🚀 My Projects
                  </h3>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleViewProjects}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View All →
                  </Button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {dashboardData.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 sm:p-6 border border-white/30 rounded-lg hover:bg-white/50 cursor-pointer transition-colors backdrop-blur-sm"
                      onClick={() =>
                        navigate(ROUTES.PROJECT_DETAIL(project.id))
                      }
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                            {project.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            by {project.creatorName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                            {project.progressPercentage}%
                          </div>
                          <div className="text-xs text-gray-500">Complete</div>
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                          <span>
                            {project.completedTaskCount} of {project.taskCount}{" "}
                            tasks
                          </span>
                          <span>{formatRelativeTime(project.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dashboardData.projects.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🚀</div>
                      <p>No projects yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Admin Quick Actions */}
          {isAdmin() && (
            <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
              <div className="p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  ⚡ Admin Quick Actions
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button
                    type="primary"
                    onClick={handleViewUsers}
                    size="large"
                    className="w-full h-10 sm:h-12 bg-brand-gradient hover:bg-brand-gradient-hover border-none shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    style={{
                      background: "linear-gradient(45deg, #1890ff, #722ed1)",
                      border: "none",
                    }}
                  >
                    👥 Manage Users
                  </Button>
                  <Button
                    type="default"
                    onClick={handleViewProjects}
                    size="large"
                    className="w-full h-10 sm:h-12 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    📁 Manage Projects
                  </Button>
                  <Button
                    type="default"
                    onClick={handleViewTasks}
                    size="large"
                    className="w-full h-10 sm:h-12 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    📝 Manage Tasks
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
