import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Dropdown, message, Spin, Empty } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTasksByProjectQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "../../store/api/tasksApi";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/dateUtils";
import type { Task } from "../../types";

interface TaskBoardProps {
  showMyTasks?: boolean;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ showMyTasks = false }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Get tasks based on the context
  const {
    data: allTasksResponse,
    isLoading: isLoadingAllTasks,
    error: allTasksError,
    refetch: refetchAllTasks,
  } = useGetTasksQuery(
    {},
    {
      skip: showMyTasks || !!projectId, // Skip if showing my tasks or project tasks
    }
  );

  const {
    data: myTasksResponse,
    isLoading: isLoadingMyTasks,
    error: myTasksError,
    refetch: refetchMyTasks,
  } = useGetMyTasksQuery(
    {},
    {
      skip: !showMyTasks || !!projectId, // Skip if not showing my tasks or showing project tasks
    }
  );

  const {
    data: projectTasks = [],
    isLoading: isLoadingProjectTasks,
    error: projectTasksError,
    refetch: refetchProjectTasks,
  } = useGetTasksByProjectQuery(projectId!, {
    skip: !projectId, // Skip this query if no projectId
  });

  // Extract tasks array from the response
  const allTasks = allTasksResponse?.tasks || [];
  const myTasks = myTasksResponse?.tasks || [];

  // Use the appropriate data based on context
  let tasks: Task[] = [];
  let isLoading = false;
  let error: any = null;
  let refetch: () => void = () => {};

  if (projectId) {
    tasks = projectTasks;
    isLoading = isLoadingProjectTasks;
    error = projectTasksError;
    refetch = refetchProjectTasks;
  } else if (showMyTasks) {
    tasks = myTasks;
    isLoading = isLoadingMyTasks;
    error = myTasksError;
    refetch = refetchMyTasks;
  } else {
    tasks = allTasks;
    isLoading = isLoadingAllTasks;
    error = allTasksError;
    refetch = refetchAllTasks;
  }

  // Mutations for task operations
  const [updateTaskStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Ensure tasks is always an array and group by status
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const todoTasks = safeTasks.filter((task) => task.status === "todo");
  const inProgressTasks = safeTasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = safeTasks.filter((task) => task.status === "done");

  const handleTaskClick = (taskId: string) => {
    navigate(ROUTES.TASK_DETAIL(taskId));
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    try {
      await updateTaskStatus({
        id: taskId,
        data: { status: newStatus },
      }).unwrap();
      message.success("Task status updated successfully!");
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
      message.success("Task deleted successfully!");
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete task");
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
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

    const menuItems = [
      {
        key: "edit",
        label: "Edit Task",
        icon: <EditOutlined />,
        onClick: () => navigate(ROUTES.EDIT_TASK(task.id)),
      },
      {
        key: "view",
        label: "View Details",
        icon: <UserOutlined />,
        onClick: () => navigate(ROUTES.TASK_DETAIL(task.id)),
      },
      ...(isAdmin()
        ? [
            {
              key: "delete",
              label: "Delete Task",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDeleteTask(task.id),
            },
          ]
        : []),
    ];

    return (
      <Card
        className="mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm border border-white/30"
        size="small"
        onClick={() => handleTaskClick(task.id)}
        actions={[
          <Dropdown menu={{ items: menuItems }} trigger={["click"]} key="more">
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>,
        ]}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {task.title}
            </h4>
            <Tag color={getPriorityColor(task.priority)} className="text-xs">
              {task.priority}
            </Tag>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Show project name when viewing all tasks */}
          {!projectId && task.project && (
            <div className="text-xs text-blue-600 font-medium">
              📁 {task.project.name}
            </div>
          )}

          {/* Status change buttons */}
          <div className="flex gap-1 mt-2">
            {task.status !== "todo" && (
              <Button
                size="small"
                type="text"
                className="text-xs px-2 py-1 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(task.id, "todo");
                }}
                disabled={isUpdatingStatus}
              >
                To Do
              </Button>
            )}
            {task.status !== "in-progress" && (
              <Button
                size="small"
                type="text"
                className="text-xs px-2 py-1 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(task.id, "in-progress");
                }}
                disabled={isUpdatingStatus}
              >
                In Progress
              </Button>
            )}
            {task.status !== "done" && (
              <Button
                size="small"
                type="text"
                className="text-xs px-2 py-1 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(task.id, "done");
                }}
                disabled={isUpdatingStatus}
              >
                Done
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {task.assignee ? (
                <div className="flex items-center gap-1">
                  <UserOutlined className="text-xs" />
                  <span className="truncate max-w-20">
                    {task.assignee.username}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarOutlined className="text-xs" />
                <span>{formatRelativeTime(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const StatusColumn: React.FC<{
    title: string;
    tasks: Task[];
    color: string;
    count: number;
  }> = ({ title, tasks, color, count }) => {
    return (
      <div className="flex-1 min-w-0">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <Tag color={color} className="text-xs">
                {count}
              </Tag>
            </div>
          </div>

          <div className="space-y-2 min-h-96">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Empty
                  description="No tasks"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="text-gray-400"
                />
              </div>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>
      </div>
    );
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
        <div className="text-red-500 text-lg mb-4">Failed to load tasks</div>
        <Button onClick={() => refetch()} type="primary">
          Try Again
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                📋{" "}
                {projectId
                  ? "Project Task Board"
                  : showMyTasks
                  ? "My Tasks"
                  : "All Tasks"}
              </h1>
              <p className="text-sm sm:text-base text-gray-800">
                {projectId
                  ? "Manage and track project tasks"
                  : showMyTasks
                  ? "View and manage your assigned tasks"
                  : "View and manage all tasks across projects"}
              </p>
            </div>
            {isAdmin() && projectId && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(ROUTES.CREATE_TASK_FOR_PROJECT(projectId!))
                }
                size="large"
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="hidden sm:inline">Create Task</span>
              </Button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatusColumn
            title="To Do"
            tasks={todoTasks}
            color="gray"
            count={todoTasks.length}
          />
          <StatusColumn
            title="In Progress"
            tasks={inProgressTasks}
            color="blue"
            count={inProgressTasks.length}
          />
          <StatusColumn
            title="Done"
            tasks={doneTasks}
            color="green"
            count={doneTasks.length}
          />
        </div>
      </div>
    </>
  );
};

export default TaskBoard;
