import React from "react";
import { Card, Tag, Avatar, Dropdown, Button } from "antd";
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
    <Card
      size="small"
      className="mb-3 hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm border border-white/30 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Activity Icon */}
        <div className="flex-shrink-0 mt-1">
          <span className="text-lg">{getActivityIcon(activity.action)}</span>
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Activity Title and Tag */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
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
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {activity.description}
                </p>
              )}

              {/* Project and Task Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                {/* User Info */}
                <div className="flex items-center gap-1">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className="truncate">
                    {activity.user?.username || "Unknown User"}
                  </span>
                </div>

                {/* Project Info */}
                {showProject && activity.project && (
                  <div className="flex items-center gap-1">
                    <ProjectOutlined />
                    <span className="truncate max-w-24 sm:max-w-32">
                      {activity.project.name}
                    </span>
                    {activity.project.status === "completed" && (
                      <CheckCircleOutlined className="text-green-500" />
                    )}
                  </div>
                )}

                {/* Task Info */}
                {showTask && activity.task && (
                  <div className="flex items-center gap-1">
                    <FileTextOutlined />
                    <span className="truncate max-w-24 sm:max-w-32">
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
                  <span className="truncate">
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                />
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
