import React from "react";
import { Tag, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formatRelativeTime } from "../../utils/dateUtils";
import {
  getActivityTitle,
  getActivityColor,
  getActivityIcon,
} from "../../utils/activityUtils";
import type { Activity } from "../../types/activity.types";
import { useAuth } from "../../hooks";
import { useDeleteActivityMutation } from "../../store/api/activitiesApi";
import { useToast } from "../../hooks/useToast";

interface ActivityCardProps {
  activity: Activity;
  showProject?: boolean;
  showTask?: boolean;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
  onActivityClick?: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  showProject = true,
  showTask = true,
  onEdit,
  onDelete,
  onActivityClick,
}) => {
  const { isAdmin } = useAuth();
  const { showSuccess, handleApiError } = useToast();
  const [deleteActivity] = useDeleteActivityMutation();

  // Get color for task status tag
  const getTaskStatusColor = (status: "todo" | "in-progress" | "done") => {
    switch (status) {
      case "todo":
        return "default";
      case "in-progress":
        return "blue";
      case "done":
        return "green";
      default:
        return "default";
    }
  };

  const handleDelete = async () => {
    try {
      await deleteActivity(activity.id).unwrap();
      showSuccess("Activity deleted successfully!");
      onDelete?.(activity.id);
    } catch (error) {
      handleApiError(error, "Failed to delete activity");
    }
  };

  const handleEdit = () => {
    onEdit?.(activity);
  };

  const menuItems = isAdmin()
    ? [
        {
          key: "edit",
          label: "Edit Activity",
          icon: <EditOutlined />,
          onClick: handleEdit,
        },
        {
          key: "delete",
          label: "Delete Activity",
          icon: <DeleteOutlined />,
          danger: true,
          onClick: handleDelete,
        },
      ]
    : [];

  const handleCardClick = () => {
    onActivityClick?.(activity);
  };

  return (
    <div
      className="glass-card rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-white/30 hover:bg-white/50 cursor-pointer group transition-all duration-200 backdrop-blur-sm"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Activity Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <span className="text-sm sm:text-base">
              {getActivityIcon(activity.action)}
            </span>
          </div>
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Activity Title and Tag */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {getActivityTitle(activity.action)}
                </span>
                <Tag
                  color={getActivityColor(activity.action)}
                  className="text-xs w-fit"
                >
                  {activity.action.replace(/_/g, " ")}
                </Tag>
              </div>

              {/* Activity Description */}
              {activity.description && (
                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                  {activity.description}
                </p>
              )}

              {/* Project and Task Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                {/* User Info */}
                <div className="flex items-center gap-2">
                  <Avatar
                    size="small"
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {activity.user?.username?.charAt(0).toUpperCase() || (
                      <UserOutlined />
                    )}
                  </Avatar>
                  <span className="truncate font-medium">
                    {activity.user?.username || "Unknown User"}
                  </span>
                </div>

                {/* Project Info */}
                {showProject && activity.project && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <ProjectOutlined className="text-purple-500" />
                    <span className="truncate max-w-24 sm:max-w-32 font-medium">
                      {activity.project.name}
                    </span>
                    {activity.project.status === "completed" && (
                      <CheckCircleOutlined className="text-green-500" />
                    )}
                  </div>
                )}

                {/* Task Info */}
                {showTask && activity.task && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span className="truncate max-w-24 sm:max-w-32 font-medium">
                      {activity.task.title}
                    </span>
                    <Tag
                      color={getTaskStatusColor(activity.task.status)}
                      className="text-xs"
                    >
                      {activity.task.status}
                    </Tag>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center gap-1">
                  <span className="truncate text-gray-500 text-xs">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin() && menuItems.length > 0 && (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  size="small"
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 bg-white/60 hover:bg-white/80"
                />
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
