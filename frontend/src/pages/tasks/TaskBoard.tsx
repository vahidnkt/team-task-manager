import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Dropdown, Spin, Empty } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type {
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTasksByProjectQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "../../store/api/tasksApi";
import { useAuth } from "../../hooks";
import { useToast } from "../../hooks/useToast";
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
  const { showSuccess, handleApiError } = useToast();

  // State for optimistic updates
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const [isUpdatingTaskId, setIsUpdatingTaskId] = useState<string | null>(null);

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
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Ensure tasks is always an array and group by status
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Use optimistic tasks if available, otherwise use actual tasks
  const displayTasks = optimisticTasks.length > 0 ? optimisticTasks : safeTasks;

  const todoTasks = displayTasks.filter((task) => task.status === "todo");
  const inProgressTasks = displayTasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = displayTasks.filter((task) => task.status === "done");

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
      showSuccess("Task status updated successfully!");
    } catch (error: any) {
      handleApiError(error, "Failed to update task status");
    }
  };

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setDragError(null);

    // Add haptic feedback for mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // Prevent page scroll on mobile during drag
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }, []);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;

      setIsDragging(false);

      // Restore page scroll on mobile
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      // If dropped outside a droppable area
      if (!destination) {
        setOptimisticTasks([]);
        return;
      }

      // If dropped in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        setOptimisticTasks([]);
        return;
      }

      // Get the new status based on the destination droppable
      const statusMap: { [key: string]: "todo" | "in-progress" | "done" } = {
        "todo-column": "todo",
        "in-progress-column": "in-progress",
        "done-column": "done",
      };

      const newStatus = statusMap[destination.droppableId];
      if (!newStatus) {
        setOptimisticTasks([]);
        return;
      }

      // Find the task being moved
      const task = safeTasks.find((t) => t.id === draggableId);
      if (!task) {
        setOptimisticTasks([]);
        return;
      }

      // Don't update if the status is the same
      if (task.status === newStatus) {
        setOptimisticTasks([]);
        return;
      }

      // Don't allow status changes for completed projects
      if (isProjectCompleted(task)) {
        setOptimisticTasks([]);
        setDragError("Cannot change status of tasks in completed projects");
        return;
      }

      // Optimistic update - immediately update the UI
      const updatedTasks = safeTasks.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      );
      setOptimisticTasks(updatedTasks);
      setIsUpdatingTaskId(draggableId);

      // Add success haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([30, 100, 30]);
      }

      try {
        await updateTaskStatus({
          id: draggableId,
          data: { status: newStatus },
        }).unwrap();

        // Clear optimistic state after successful update
        setOptimisticTasks([]);
        setIsUpdatingTaskId(null);
        showSuccess("Task moved successfully!");
      } catch (error: any) {
        // Revert optimistic update on error
        setOptimisticTasks([]);
        setIsUpdatingTaskId(null);
        setDragError(error?.data?.message || "Failed to move task");

        // Error haptic feedback
        if ("vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]);
        }

        handleApiError(error, "Failed to move task");
      }
    },
    [safeTasks, updateTaskStatus]
  );

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
      showSuccess("Task deleted successfully!");
    } catch (error: any) {
      handleApiError(error, "Failed to delete task");
    }
  };

  // Helper function to check if a project is completed
  const isProjectCompleted = (task: Task): boolean => {
    return task.project?.status === "completed";
  };

  const TaskCard: React.FC<{ task: Task; index: number }> = ({
    task,
    index,
  }) => {
    const projectCompleted = isProjectCompleted(task);

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

    // If project is completed, render without drag functionality
    if (projectCompleted) {
      return (
        <div className="mb-3">
          <Card
            className="cursor-default hover:shadow-lg transition-all duration-300 bg-green-50/90 border-green-200"
            size="small"
            onClick={() => handleTaskClick(task.id)}
            style={{
              minHeight: "100px",
              userSelect: "none",
            }}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-green-500 text-sm">🔒</span>
                  <h4 className="font-medium text-green-800 text-sm leading-tight">
                    ✅ {task.title}
                  </h4>
                </div>
                <Tag
                  color={getPriorityColor(task.priority)}
                  className="text-xs"
                >
                  {task.priority}
                </Tag>
              </div>

              {task.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}

              {!projectId && task.project && (
                <div className="text-xs text-blue-600 font-medium">
                  📁 {task.project.name}
                </div>
              )}

              <div className="mt-2 p-2 bg-green-100 rounded-md border border-green-200">
                <p className="text-xs text-green-700 font-medium">
                  ✅ Project completed - Status changes disabled
                </p>
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
        </div>
      );
    }

    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 transition-all duration-300 ${
              snapshot.isDragging ? "opacity-90 transform rotate-1" : ""
            }`}
            style={{
              ...provided.draggableProps.style,
              cursor: snapshot.isDragging ? "grabbing" : "grab",
            }}
          >
            <Card
              className={`cursor-grab hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-white/30 ${
                projectCompleted ? "bg-green-50/90 border-green-200" : ""
              } ${
                snapshot.isDragging
                  ? "shadow-2xl rotate-1 scale-105 z-50 bg-white/95 cursor-grabbing"
                  : ""
              } ${isDragging && !snapshot.isDragging ? "opacity-90" : ""} ${
                isUpdatingTaskId === task.id
                  ? "animate-pulse border-blue-400 shadow-lg transform scale-102"
                  : "hover:scale-101"
              }`}
              size="small"
              onClick={() =>
                !isDragging && !isUpdatingTaskId && handleTaskClick(task.id)
              }
              style={{
                minHeight: "100px",
                transform: snapshot.isDragging
                  ? "rotate(2deg)"
                  : isUpdatingTaskId === task.id
                  ? "scale(1.02)"
                  : "none",
                transition: !snapshot.isDragging
                  ? "all 500ms cubic-bezier(0.25, 0.8, 0.25, 1)"
                  : "none",
                userSelect: "none",
              }}
              actions={[
                <Dropdown
                  menu={{ items: menuItems }}
                  trigger={["click"]}
                  key="more"
                >
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
                  <div className="flex items-center gap-2 flex-1">
                    <DragOutlined
                      className={`text-gray-400 text-sm cursor-grab active:cursor-grabbing transition-all duration-300 ${
                        snapshot.isDragging
                          ? "text-blue-500 transform scale-110"
                          : ""
                      } ${
                        isUpdatingTaskId === task.id
                          ? "animate-spin text-blue-500"
                          : ""
                      } hover:text-gray-600 hover:scale-110`}
                    />
                    <h4
                      className={`font-medium text-sm leading-tight transition-all duration-300 ${
                        projectCompleted ? "text-green-800" : "text-gray-900"
                      } ${
                        isUpdatingTaskId === task.id
                          ? "opacity-60 transform scale-95"
                          : ""
                      }`}
                    >
                      {projectCompleted && (
                        <span className="mr-1 text-xs">✅</span>
                      )}
                      {task.title}
                      {isUpdatingTaskId === task.id && (
                        <span className="ml-2 text-xs text-blue-600 animate-pulse">
                          🔄 Updating...
                        </span>
                      )}
                    </h4>
                  </div>
                  <Tag
                    color={getPriorityColor(task.priority)}
                    className="text-xs"
                  >
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

                {/* Status change buttons with smooth animations */}
                {!projectCompleted && (
                  <div
                    className={`flex gap-1 mt-2 transition-all duration-300 ${
                      isDragging ? "hidden sm:flex" : "flex"
                    }`}
                  >
                    {task.status !== "todo" && (
                      <Button
                        size="small"
                        type="text"
                        className={`text-xs px-2 py-1 h-8 sm:h-6 touch-manipulation transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95 ${
                          isUpdatingTaskId === task.id
                            ? "animate-pulse bg-blue-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, "todo");
                        }}
                        disabled={isUpdatingTaskId === task.id}
                        loading={isUpdatingTaskId === task.id}
                      >
                        📝 To Do
                      </Button>
                    )}
                    {task.status !== "in-progress" && (
                      <Button
                        size="small"
                        type="text"
                        className={`text-xs px-2 py-1 h-8 sm:h-6 touch-manipulation transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95 ${
                          isUpdatingTaskId === task.id
                            ? "animate-pulse bg-blue-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, "in-progress");
                        }}
                        disabled={isUpdatingTaskId === task.id}
                        loading={isUpdatingTaskId === task.id}
                      >
                        ⚡ In Progress
                      </Button>
                    )}
                    {task.status !== "done" && (
                      <Button
                        size="small"
                        type="text"
                        className={`text-xs px-2 py-1 h-8 sm:h-6 touch-manipulation transition-all duration-300 hover:bg-green-50 hover:scale-105 active:scale-95 ${
                          isUpdatingTaskId === task.id
                            ? "animate-pulse bg-green-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, "done");
                        }}
                        disabled={isUpdatingTaskId === task.id}
                        loading={isUpdatingTaskId === task.id}
                      >
                        ✅ Done
                      </Button>
                    )}
                  </div>
                )}

                {/* Show completed project message */}
                {projectCompleted && (
                  <div className="mt-2 p-2 bg-green-100 rounded-md border border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      ✅ Project completed - Status changes disabled
                    </p>
                  </div>
                )}

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
          </div>
        )}
      </Draggable>
    );
  };

  const StatusColumn: React.FC<{
    title: string;
    tasks: Task[];
    color: string;
    count: number;
    droppableId: string;
  }> = ({ title, tasks, color, count, droppableId }) => {
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

          <Droppable droppableId={droppableId}>
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 min-h-96 transition-all duration-300 p-2 rounded-lg touch-manipulation ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50/80 border-2 border-blue-300 border-dashed transform scale-101"
                    : "border-2 border-transparent"
                } ${
                  isDragging && !snapshot.isDraggingOver ? "bg-gray-50/30" : ""
                }`}
                style={{
                  minHeight: window.innerWidth < 768 ? "300px" : "384px",
                  transition: "all 300ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
              >
                {tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Empty
                      description="No tasks"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      className="text-gray-400"
                    />
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
                  ? "Manage and track project tasks - Drag tasks between columns to update status"
                  : showMyTasks
                  ? "View and manage your assigned tasks - Drag tasks between columns to update status"
                  : "View and manage all tasks across projects - Drag tasks between columns to update status"}
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

        {/* Mobile drag instruction */}
        {isDragging && (
          <div className="glass-card rounded-lg p-3 mb-4 border border-blue-300 bg-blue-50/80 backdrop-blur-sm block md:hidden">
            <p className="text-sm text-blue-800 font-medium text-center">
              📱 Drag the task to a different column to change its status
            </p>
          </div>
        )}

        {/* Error message */}
        {dragError && (
          <div className="glass-card rounded-lg p-3 mb-4 border border-red-300 bg-red-50/80 backdrop-blur-sm">
            <p className="text-sm text-red-800 font-medium text-center">
              ❌ {dragError}
            </p>
          </div>
        )}

        {/* Kanban Board */}
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 touch-pan-y md:touch-auto">
            <StatusColumn
              title="To Do"
              tasks={todoTasks}
              color="gray"
              count={todoTasks.length}
              droppableId="todo-column"
            />
            <StatusColumn
              title="In Progress"
              tasks={inProgressTasks}
              color="blue"
              count={inProgressTasks.length}
              droppableId="in-progress-column"
            />
            <StatusColumn
              title="Done"
              tasks={doneTasks}
              color="green"
              count={doneTasks.length}
              droppableId="done-column"
            />
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskBoard;
