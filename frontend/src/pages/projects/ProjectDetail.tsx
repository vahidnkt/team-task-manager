import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Progress, Spin, Alert, Empty, Divider } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";
import { useGetProjectQuery } from "../../store/api/projectsApi";
import { formatRelativeTime } from "../../utils/dateUtils";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // API hooks
  const { data: project, isLoading, error } = useGetProjectQuery(id!);

  const handleBack = () => {
    navigate(ROUTES.PROJECTS);
  };

  const handleEdit = () => {
    navigate(ROUTES.EDIT_PROJECT(id!));
  };

  const handleCreateTask = () => {
    navigate(ROUTES.CREATE_TASK_FOR_PROJECT(id!));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert
          message="Error Loading Project"
          description="Failed to load project details. Please try again."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert
          message="Project Not Found"
          description="The project you're looking for doesn't exist or has been deleted."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate(ROUTES.PROJECTS)}>
              Back to Projects
            </Button>
          }
        />
      </div>
    );
  }

  // Calculate project statistics
  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determine project status
  let projectStatus = "Not Started";
  let statusColor = "default";

  if (totalTasks > 0) {
    if (completedTasks === totalTasks) {
      projectStatus = "Completed";
      statusColor = "success";
    } else if (completedTasks > 0) {
      projectStatus = "In Progress";
      statusColor = "processing";
    } else {
      projectStatus = "Active";
      statusColor = "warning";
    }
  }

  return (
    <>
      {/* Animated background */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700"
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  📁 {project.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Tag color={statusColor} className="text-sm">
                    {projectStatus}
                  </Tag>
                  <span className="flex items-center gap-1">
                    <UserOutlined />
                    {project.creator?.username || "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarOutlined />
                    {formatRelativeTime(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            {isAdmin() && (
              <div className="flex gap-2">
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleCreateTask}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Add Task
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Project Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Description */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <FileTextOutlined />
                Description
              </h3>
              {project.description ? (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-gray-500 italic">
                  No description provided
                </p>
              )}
            </div>

            {/* Tasks */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  📝 Tasks ({totalTasks})
                </h3>
                {isAdmin() && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateTask}
                    size="small"
                    className="w-full sm:w-auto"
                  >
                    Add Task
                  </Button>
                )}
              </div>

              {totalTasks === 0 ? (
                <Empty
                  description="No tasks yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {isAdmin() && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreateTask}
                    >
                      Create First Task
                    </Button>
                  )}
                </Empty>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-2 sm:p-3 border border-white/30 rounded-lg hover:bg-white/50 cursor-pointer transition-colors backdrop-blur-sm"
                      onClick={() => navigate(ROUTES.TASK_DETAIL(task.id))}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <Tag
                            color={
                              task.status === "done"
                                ? "success"
                                : task.status === "in-progress"
                                ? "processing"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {task.status === "done"
                              ? "Done"
                              : task.status === "in-progress"
                              ? "In Progress"
                              : "Todo"}
                          </Tag>
                          <Tag
                            color={
                              task.priority === "high"
                                ? "red"
                                : task.priority === "medium"
                                ? "orange"
                                : "green"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ))}
                  {totalTasks > 5 && (
                    <div className="text-center pt-2">
                      <Button
                        type="link"
                        onClick={() =>
                          navigate(ROUTES.TASKS, { state: { projectId: id } })
                        }
                      >
                        View all {totalTasks} tasks →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Progress */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress
                    percent={progressPercentage}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                    className="mb-4"
                  />
                </div>

                <Divider className="my-4" />

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CheckCircleOutlined className="text-green-500 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Completed
                      </span>
                    </div>
                    <span className="font-semibold text-green-600 text-sm sm:text-base">
                      {completedTasks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ClockCircleOutlined className="text-blue-500 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        In Progress
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm sm:text-base">
                      {inProgressTasks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ExclamationCircleOutlined className="text-orange-500 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Pending
                      </span>
                    </div>
                    <span className="font-semibold text-orange-600 text-sm sm:text-base">
                      {pendingTasks}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Project Info
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Created by
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                      {project.creator?.username?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {project.creator?.username || "Unknown"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Created
                  </span>
                  <div className="text-gray-900 text-sm sm:text-base">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Last updated
                  </span>
                  <div className="text-gray-900 text-sm sm:text-base">
                    {formatRelativeTime(project.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
