import React from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { useAuth } from "../../hooks";
import { formatRelativeTime } from "../../utils/dateUtils";
import { ROUTES } from "../../router";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-centered section-padding">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Text */}
            <div className="animate-fade-in">
              <h1 className="text-responsive-xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username || "User"}! 👋
              </h1>
              <p className="text-responsive-base text-gray-600">
                {isAdmin()
                  ? "Admin Dashboard - Manage your entire system"
                  : "Your personal task management hub"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
              <Button
                variant="primary"
                onClick={handleCreateTask}
                className="btn-primary gradient-primary shadow-lg hover:shadow-xl"
              >
                ✨ Create Task
              </Button>
              {isAdmin() && (
                <Button
                  variant="secondary"
                  onClick={handleCreateProject}
                  className="btn-secondary"
                >
                  📁 Create Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-centered py-8 space-y-8">
        {/* Stats Cards */}
        <div className="animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            📊 Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Tasks"
              value={dashboardData.stats.totalTasks}
              subtitle={
                isAdmin() ? "All tasks in system" : "Tasks assigned to you"
              }
              color="primary"
              icon="📋"
            />
            <StatsCard
              title="Completed"
              value={dashboardData.stats.completedTasks}
              subtitle="Finished tasks"
              color="success"
              icon="✅"
            />
            <StatsCard
              title="In Progress"
              value={dashboardData.stats.inProgressTasks}
              subtitle="Active tasks"
              color="warning"
              icon="🔄"
            />
            <StatsCard
              title="Overdue"
              value={dashboardData.stats.overdueTasks}
              subtitle="Past due date"
              color="error"
              icon="⚠️"
            />
          </div>
        </div>

        {/* Admin-specific stats */}
        {isAdmin() && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              🔧 Admin Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Projects"
                value={dashboardData.stats.totalProjects}
                subtitle="All projects in system"
                color="secondary"
                icon="📁"
              />
              <StatsCard
                title="Active Projects"
                value={dashboardData.stats.activeProjects}
                subtitle="Currently running"
                color="primary"
                icon="🚀"
              />
              <StatsCard
                title="Total Users"
                value={25}
                subtitle="Registered users"
                color="warning"
                icon="👥"
              />
            </div>
          </div>
        )}

        {/* User-specific project stats */}
        {!isAdmin() && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              📂 My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="My Projects"
                value={dashboardData.stats.totalProjects}
                subtitle="Projects you're involved in"
                color="secondary"
                icon="📁"
              />
              <StatsCard
                title="Active Projects"
                value={dashboardData.stats.activeProjects}
                subtitle="Currently working"
                color="primary"
                icon="🚀"
              />
              <StatsCard
                title="Completed Projects"
                value={dashboardData.stats.completedProjects}
                subtitle="Finished projects"
                color="success"
                icon="🎉"
              />
            </div>
          </div>
        )}

        {/* Recent Tasks and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
          {/* Recent Tasks */}
          <div className="card hover:shadow-lg transition-all duration-300">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  📝 {isAdmin() ? "Recent Tasks" : "My Recent Tasks"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewTasks}
                  className="btn-ghost"
                >
                  View All →
                </Button>
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {dashboardData.recentTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TaskCard task={task} />
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
          <div className="card hover:shadow-lg transition-all duration-300">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                ⚡ {isAdmin() ? "System Activities" : "My Activities"}
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ActivityCard activity={activity} />
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
          <div className="card animate-slide-up hover:shadow-lg transition-all duration-300">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  🚀 My Projects
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewProjects}
                  className="btn-ghost"
                >
                  View All →
                </Button>
              </div>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ProjectCard project={project} />
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
          <div className="card animate-slide-up hover:shadow-lg transition-all duration-300">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                ⚡ Admin Quick Actions
              </h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  onClick={handleViewUsers}
                  className="w-full btn-primary interactive"
                >
                  👥 Manage Users
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleViewProjects}
                  className="w-full btn-secondary interactive"
                >
                  📁 Manage Projects
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleViewTasks}
                  className="w-full btn-secondary interactive"
                >
                  📝 Manage Tasks
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  color: "primary" | "success" | "warning" | "error" | "secondary";
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color,
  icon,
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50 border-primary-100",
    success: "text-success-600 bg-success-50 border-success-100",
    warning: "text-warning-600 bg-warning-50 border-warning-100",
    error: "text-error-600 bg-error-50 border-error-100",
    secondary: "text-secondary-600 bg-secondary-50 border-secondary-100",
  };

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 interactive">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div
            className={`p-4 rounded-2xl border-2 ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
          >
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: string;
    projectId: string;
    projectName: string;
    assigneeId?: string;
    assigneeName?: string;
    createdAt: string;
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(ROUTES.TASK_DETAIL(task.id));
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md cursor-pointer transition-all duration-200 group"
      onClick={handleTaskClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {task.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {task.projectName}
          </p>
          {task.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      {task.dueDate && (
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

// Activity Card Component
interface ActivityCardProps {
  activity: {
    id: string;
    action: string;
    description: string;
    userId: string;
    userName: string;
    projectId?: string;
    projectName?: string;
    taskId?: string;
    taskTitle?: string;
    createdAt: string;
  };
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "task_completed":
        return "✅";
      case "task_created":
        return "➕";
      case "project_created":
        return "📁";
      case "user_created":
        return "👤";
      case "task_assigned":
        return "👥";
      default:
        return "📝";
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "task_completed":
        return "text-green-600 bg-green-100";
      case "task_created":
        return "text-blue-600 bg-blue-100";
      case "project_created":
        return "text-purple-600 bg-purple-100";
      case "user_created":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
        <span className="text-sm">{getActivityIcon(activity.action)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500">{activity.userName}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    taskCount: number;
    completedTaskCount: number;
    progressPercentage: number;
    createdBy: string;
    creatorName: string;
    createdAt: string;
    updatedAt: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate(ROUTES.PROJECT_DETAIL(project.id));
  };

  return (
    <div
      className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleProjectClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{project.name}</h4>
          <p className="text-sm text-gray-600 mt-1">by {project.creatorName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {project.progressPercentage}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
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

        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {project.completedTaskCount} of {project.taskCount} tasks
          </span>
          <span>{formatRelativeTime(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
