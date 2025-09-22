import React from "react";
import { cn, getStatusColor } from "../../utils/helpers";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "subtle";
  className?: string;
  showIcon?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-base",
};

// Status icons mapping
const statusIcons: Record<string, React.ReactNode> = {
  todo: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  in_progress: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  in_review: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  done: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  active: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  completed: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  on_hold: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  cancelled: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  variant = "solid",
  className,
  showIcon = false,
}) => {
  const statusColor = getStatusColor(status);
  const sizeClass = sizeClasses[size];
  const icon = statusIcons[status];

  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border-2";
      case "subtle":
        return "bg-opacity-20";
      default:
        return "";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        statusColor,
        sizeClass,
        getVariantClasses(),
        className
      )}
    >
      {showIcon && icon && <span className="mr-1">{icon}</span>}
      {formatStatus(status)}
    </span>
  );
};

// Task status badge with specific styling
export const TaskStatusBadge: React.FC<
  Omit<StatusBadgeProps, "status"> & {
    status: "todo" | "in_progress" | "in_review" | "done";
  }
> = (props) => {
  return <StatusBadge {...props} showIcon />;
};

// Project status badge with specific styling
export const ProjectStatusBadge: React.FC<
  Omit<StatusBadgeProps, "status"> & {
    status: "active" | "completed" | "on_hold" | "cancelled";
  }
> = (props) => {
  return <StatusBadge {...props} showIcon />;
};
