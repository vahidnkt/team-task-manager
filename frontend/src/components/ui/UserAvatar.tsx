import React from "react";
import { cn, getInitials } from "../../utils/helpers";

interface UserAvatarProps {
  user?: {
    username: string;
    email?: string;
    avatar?: string;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showOnline?: boolean;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const onlineIndicatorClasses = {
  xs: "h-2 w-2 bottom-0 right-0",
  sm: "h-2 w-2 bottom-0 right-0",
  md: "h-3 w-3 bottom-0 right-0",
  lg: "h-3 w-3 -bottom-1 -right-1",
  xl: "h-4 w-4 -bottom-1 -right-1",
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  showOnline = false,
  isOnline = false,
  className,
  onClick,
}) => {
  const initials = user ? getInitials(user.username) : "U";
  const sizeClass = sizeClasses[size];
  const onlineClass = onlineIndicatorClasses[size];

  const avatarContent = (
    <>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-blue-600 text-white font-medium overflow-hidden",
          sizeClass,
          onClick && "cursor-pointer hover:bg-blue-700 transition-colors",
          className
        )}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = initials;
              }
            }}
          />
        ) : (
          initials
        )}

        {/* Online indicator */}
        {showOnline && (
          <div
            className={cn(
              "absolute rounded-full border-2 border-white",
              onlineClass,
              isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          />
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        {avatarContent}
      </button>
    );
  }

  return avatarContent;
};

// Avatar group component for showing multiple users
interface AvatarGroupProps {
  users: Array<{
    username: string;
    email?: string;
    avatar?: string;
  }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = "sm",
  className,
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleUsers.map((user, index) => (
        <UserAvatar
          key={`${user.username}-${index}`}
          user={user}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-gray-500 text-white font-medium ring-2 ring-white",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Avatar with tooltip
interface AvatarWithTooltipProps extends UserAvatarProps {
  tooltip?: string;
}

export const AvatarWithTooltip: React.FC<AvatarWithTooltipProps> = ({
  tooltip,
  ...props
}) => {
  if (!tooltip) {
    return <UserAvatar {...props} />;
  }

  return (
    <div className="relative group">
      <UserAvatar {...props} />
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};
