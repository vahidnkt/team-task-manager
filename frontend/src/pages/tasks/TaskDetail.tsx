import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Spin, Alert, Empty, Space, Divider, message } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useGetTaskQuery,
  useDeleteTaskMutation,
} from "../../store/api/tasksApi";
import { useGetCommentsByTaskQuery } from "../../store/api/commentsApi";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../utils/constants";
import { formatRelativeTime, formatDate } from "../../utils/dateUtils";

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: task, isLoading, error } = useGetTaskQuery(id!);
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: comments = [] } = useGetCommentsByTaskQuery(id!);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(ROUTES.EDIT_TASK(id!));
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id!).unwrap();
      message.success("Task deleted successfully!");
      navigate(ROUTES.PROJECT_DETAIL(task?.projectId!));
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "default";
      case "in-progress":
        return "processing";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <ExclamationCircleOutlined />;
      case "in-progress":
        return <ClockCircleOutlined />;
      case "done":
        return <CheckCircleOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Alert
          message="Error"
          description="Failed to load task details"
          type="error"
          showIcon
        />
        <Button
          onClick={handleBack}
          className="mt-4 h-10 px-6 text-sm rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
          style={{
            background: "linear-gradient(to right, #2563eb, #9333ea)",
            border: "none",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #1d4ed8, #7c3aed)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #2563eb, #9333ea)";
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <Alert
          message="Not Found"
          description="Task not found"
          type="warning"
          showIcon
        />
        <Button
          onClick={handleBack}
          className="mt-4 h-10 px-6 text-sm rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
          style={{
            background: "linear-gradient(to right, #2563eb, #9333ea)",
            border: "none",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #1d4ed8, #7c3aed)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #2563eb, #9333ea)";
          }}
        >
          Go Back
        </Button>
      </div>
    );
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
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-white/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            />
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                📋 {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Tag
                  color={getStatusColor(task.status)}
                  icon={getStatusIcon(task.status)}
                >
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "in-progress"
                    ? "In Progress"
                    : "Done"}
                </Tag>
                <Tag color={getPriorityColor(task.priority)}>
                  {task.priority} Priority
                </Tag>
                {task.project && <Tag color="blue">{task.project.name}</Tag>}
              </div>
            </div>
            {isAdmin() && (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  className="h-10 px-4 text-sm rounded-lg bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium transition-all duration-200"
                >
                  Edit
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  loading={isDeleting}
                  className="h-10 px-4 text-sm rounded-lg"
                >
                  Delete
                </Button>
              </Space>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Description */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Description
              </h3>
              {task.description ? (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-gray-500 italic">
                  No description provided
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Comments
              </h3>
              <Empty
                description="No comments yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="text-gray-400"
              >
                <Button
                  type="primary"
                  onClick={() => navigate(ROUTES.TASK_COMMENTS(id!))}
                  className="mt-2 h-10 px-6 text-sm rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    border: "none",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #1d4ed8, #7c3aed)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #2563eb, #9333ea)";
                  }}
                >
                  💬 Add Comment ({comments.length})
                </Button>
              </Empty>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Task Info */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Task Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Assignee
                  </span>
                  <div className="mt-1">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                          {task.assignee.username?.charAt(0).toUpperCase() ||
                            "U"}
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {task.assignee.username}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm sm:text-base text-gray-500 italic">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                <Divider className="my-3" />

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Status
                  </span>
                  <div className="mt-1">
                    <Tag
                      color={getStatusColor(task.status)}
                      icon={getStatusIcon(task.status)}
                      className="text-sm"
                    >
                      {task.status === "todo"
                        ? "To Do"
                        : task.status === "in-progress"
                        ? "In Progress"
                        : "Done"}
                    </Tag>
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Priority
                  </span>
                  <div className="mt-1">
                    <Tag
                      color={getPriorityColor(task.priority)}
                      className="text-sm"
                    >
                      {task.priority}
                    </Tag>
                  </div>
                </div>

                {task.dueDate && (
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Due Date
                    </span>
                    <div className="text-sm sm:text-base text-gray-900 mt-1">
                      {formatDate(task.dueDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(task.dueDate)}
                    </div>
                  </div>
                )}

                <Divider className="my-3" />

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Created
                  </span>
                  <div className="text-sm sm:text-base text-gray-900 mt-1">
                    {formatDate(task.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(task.createdAt)}
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Last Updated
                  </span>
                  <div className="text-sm sm:text-base text-gray-900 mt-1">
                    {formatDate(task.updatedAt)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(task.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  type="primary"
                  onClick={() => navigate(ROUTES.TASK_COMMENTS(id!))}
                  className="w-full h-10 text-sm rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    border: "none",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #1d4ed8, #7c3aed)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #2563eb, #9333ea)";
                  }}
                >
                  💬 Comments ({comments.length})
                </Button>
                {isAdmin() && (
                  <Button
                    onClick={handleEdit}
                    className="w-full h-10 text-sm rounded-lg bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium transition-all duration-200"
                  >
                    Edit Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
