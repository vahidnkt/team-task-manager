import React from "react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { cn } from "../../utils/helpers";

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
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
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
        return {
          bg: "bg-green-100 border-green-200",
          text: "text-green-700",
          iconBg: "bg-green-500"
        };
      case "task_created":
        return {
          bg: "bg-blue-100 border-blue-200",
          text: "text-blue-700",
          iconBg: "bg-blue-500"
        };
      case "project_created":
        return {
          bg: "bg-purple-100 border-purple-200",
          text: "text-purple-700",
          iconBg: "bg-purple-500"
        };
      case "user_created":
        return {
          bg: "bg-orange-100 border-orange-200",
          text: "text-orange-700",
          iconBg: "bg-orange-500"
        };
      case "task_assigned":
        return {
          bg: "bg-indigo-100 border-indigo-200",
          text: "text-indigo-700",
          iconBg: "bg-indigo-500"
        };
      default:
        return {
          bg: "bg-gray-100 border-gray-200",
          text: "text-gray-700",
          iconBg: "bg-gray-500"
        };
    }
  };

  const colors = getActivityColor(activity.action);

  return (
    <div className={cn(
      "flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-500 group relative",
      "hover:shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-blue-500/20",
      "hover:rotate-1 hover:border-opacity-60",
      "transform-gpu", // Hardware acceleration
      colors.bg,
      className
    )}>
      {/* Glow effect */}
      <div className={cn(
        "absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur",
        colors.iconBg
      )} />
      {/* Enhanced 3D Icon Container */}
      <div className="relative z-10">
        {/* Icon glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-md",
            colors.iconBg
          )}
        />

        <div
          className={cn(
            "relative p-2 rounded-full text-white shadow-lg transition-all duration-500 z-10",
            "group-hover:scale-125 group-hover:rotate-12 group-hover:-translate-y-1",
            "group-hover:shadow-2xl",
            "transform-gpu",
            colors.iconBg
          )}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            willChange: "transform"
          }}
        >
          <span className="text-sm block transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            {getActivityIcon(activity.action)}
          </span>
        </div>

        {/* Particle effects */}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium transition-colors duration-200", colors.text)}>
          {activity.description}
        </p>

        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-600 font-medium">
            👤 {activity.userName}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>

        {/* Project info if available */}
        {activity.projectName && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
              📁 {activity.projectName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;