import React from "react";
import { cn, getPriorityColor } from "../../utils/helpers";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
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

// Priority icons mapping
const priorityIcons: Record<string, React.ReactNode> = {
  low: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  medium: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  high: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  urgent: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "sm",
  variant = "solid",
  className,
  showIcon = false,
}) => {
  const priorityColor = getPriorityColor(priority);
  const sizeClass = sizeClasses[size];
  const icon = priorityIcons[priority];

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

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        priorityColor,
        sizeClass,
        getVariantClasses(),
        className
      )}
    >
      {showIcon && icon && <span className="mr-1">{icon}</span>}
      {formatPriority(priority)}
    </span>
  );
};

// Priority indicator with dots
interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high" | "urgent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const dotSizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

const dotCountClasses = {
  low: "1",
  medium: "2",
  high: "3",
  urgent: "4",
};

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  size = "sm",
  className,
}) => {
  const priorityColor = getPriorityColor(priority);
  const dotSizeClass = dotSizeClasses[size];
  const dotCount = parseInt(dotCountClasses[priority]);

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: dotCount }).map((_, index) => (
        <div
          key={index}
          className={cn("rounded-full", dotSizeClass, priorityColor)}
        />
      ))}
    </div>
  );
};

// Priority level selector component
interface PrioritySelectorProps {
  value?: "low" | "medium" | "high" | "urgent";
  onChange?: (priority: "low" | "medium" | "high" | "urgent") => void;
  className?: string;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const priorities: Array<"low" | "medium" | "high" | "urgent"> = [
    "low",
    "medium",
    "high",
    "urgent",
  ];

  return (
    <div className={cn("flex space-x-2", className)}>
      {priorities.map((priority) => (
        <button
          key={priority}
          onClick={() => onChange?.(priority)}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors",
            value === priority
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <PriorityIndicator priority={priority} size="sm" />
          <span className="text-sm font-medium capitalize">{priority}</span>
        </button>
      ))}
    </div>
  );
};
