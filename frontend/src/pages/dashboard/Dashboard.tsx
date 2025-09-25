import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Alert } from "antd";
import { useAuth, useDashboard } from "../../hooks";
import { ROUTES } from "../../router";
import { formatRelativeTime } from "../../utils/dateUtils";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PriorityBadge } from "../../components/ui/PriorityBadge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const {
    dashboardData,
    isLoading,
    error,
    refresh,
    stats,
    recentTasks,
    recentActivities,
    projects,
    metadata,
  } = useDashboard({
    autoFetch: true,
    refetchInterval: 30000, // Refresh every 30 seconds
    statsDays: 30,
    recentTasksLimit: 10,
    recentActivitiesLimit: 10,
    projectsLimit: 20,
    projectsStatus: "all",
  });

  // Determine user role from metadata or auth context
  const userRole = metadata?.userRole || (isAdmin() ? "admin" : "user");
  const isUserAdmin = userRole === "admin" || isAdmin();

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

  // Show loading state
  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "Failed to load dashboard data";

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert
          message="Error Loading Dashboard"
          description={errorMessage}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refresh()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // Data is now properly handled in the API layer with fallbacks
  const currentStats = stats;
  const currentRecentTasks = recentTasks;
  const currentRecentActivities = recentActivities;
  const currentProjects = projects;

  // Debug logging to help identify data structure issues
  if (process.env.NODE_ENV === "development") {
    console.log("Dashboard Debug Data:", {
      recentTasks,
      recentTasksType: typeof recentTasks,
      isArray: Array.isArray(recentTasks),
      currentRecentTasks,
      recentActivities,
      recentActivitiesType: typeof recentActivities,
      projects,
      projectsType: typeof projects,
    });
  }

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
            <div className="zin">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Hi {user?.username || "User"}! 👋
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                {isUserAdmin
                  ? "Admin Dashboard - Manage your entire system"
                  : "Your personal task management hub"}
              </p>
              {metadata && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Last updated:{" "}
                  {new Date(metadata.generatedAt).toLocaleString()} • Data
                  range: {metadata.dataRange.statsDays} days
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleCreateTask}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ✨ Create Task
              </button>
              {isUserAdmin && (
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
                      {currentStats.totalTasks}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      {isUserAdmin
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
                      {currentStats.completedTasks}
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
                      {currentStats.inProgressTasks}
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
                      {currentStats.overdueTasks}
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
          {isUserAdmin && (
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
                        {currentStats.totalProjects}
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
                        {currentStats.activeProjects}
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
                        {currentStats.totalUsers || 0}
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
          {!isUserAdmin && (
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
                        {currentStats.totalProjects}
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
                        {currentStats.activeProjects}
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
                        {currentStats.completedProjects}
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
                    📝 {isUserAdmin ? "Recent Tasks" : "My Recent Tasks"}
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
                  {currentRecentTasks.map((task) => (
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
                  {currentRecentTasks.length === 0 && (
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
                  ⚡ {isUserAdmin ? "System Activities" : "My Activities"}
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {currentRecentActivities.map((activity) => (
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
                  {currentRecentActivities.length === 0 && (
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
          {!isUserAdmin && currentProjects.length > 0 && (
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
                  {currentProjects.map((project) => (
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
                  {currentProjects.length === 0 && (
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
          {isUserAdmin && (
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
