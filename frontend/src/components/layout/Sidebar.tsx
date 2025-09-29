import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import { useGetProjectsQuery } from "../../store/api/projectsApi";
import {
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Activity,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  badge?: string | number | (() => string | number);
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Fetch projects data for dynamic badge count
  const { data: projectsData } = useGetProjectsQuery({
    search: "",
    status: undefined,
    priority: undefined,
    limit: 100, // Get a higher limit to count all projects
    offset: 0,
    sortBy: "created_at",
    sortOrder: "DESC",
  });
  const projectCount = projectsData?.total || 0;

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen className="h-5 w-5" />,
      path: "/projects",
      badge: projectCount,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      children: [
        {
          id: "my-tasks",
          label: "My Tasks",
          icon: <CheckSquare className="h-4 w-4" />,
          path: "/tasks/my",
        },
        {
          id: "all-tasks",
          label: "All Tasks",
          icon: <CheckSquare className="h-4 w-4" />,
          path: "/tasks",
        },
      ],
    },

    {
      id: "activities",
      label: "Activities",
      icon: <Activity className="h-5 w-5" />,
      path: "/activities",
    },
    {
      id: "admin",
      label: "Admin",
      icon: <Settings className="h-5 w-5" />,
      permission: "users:read",
      children: [
        {
          id: "users",
          label: "Users",
          icon: <Users className="h-4 w-4" />,
          path: "/users",
          permission: "users:read",
        },
      ],
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      // Navigate to the path
      navigate(item.path);
    }
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(
        (child) => child.path && location.pathname === child.path
      );
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    // Check permissions
    if (
      item.permission &&
      !hasPermission(
        item.permission as "users:read" | "projects:read" | "tasks:read"
      )
    ) {
      return null;
    }

    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center justify-between px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors",
            "hover:bg-gray-50 focus:outline-none",
            // Only show focus ring for parent items (level 0)
            level === 0 &&
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            // Different styling for parent vs child items
            level === 0 &&
              isActive &&
              "bg-blue-50 text-blue-600 border border-blue-200",
            level === 0 && !isActive && "text-gray-700 hover:text-gray-900",
            // Child item styling - no borders
            level > 0 && isActive && "bg-blue-100 text-blue-700 ml-2",
            level > 0 &&
              !isActive &&
              "text-gray-600 hover:text-gray-800 hover:bg-gray-50 ml-2",
            level > 0 && "ml-3 sm:ml-4"
          )}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className={cn("flex-shrink-0", level > 0 && "h-4 w-4")}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className="truncate text-xs sm:text-sm">{item.label}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {item.badge && !collapsed && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {typeof item.badge === "function" ? item.badge() : item.badge}
              </span>
            )}
            {hasChildren && !collapsed && (
              <span className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </span>
            )}
          </div>
        </button>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "transition-all duration-300 h-screen flex flex-col bg-transparent border-r-0",
        // Desktop: dynamic width based on collapsed state
        collapsed ? "lg:w-16" : "lg:w-64",
        // Mobile: always full width when visible
        "w-full"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm">
                TM
              </span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Task Manager
                </h2>
                <p className="text-xs text-gray-500">Project Management</p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          {/* {onToggle && (
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                  collapsed ? "rotate-0" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )} */}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-3 sm:p-4">
          <div
            className={cn(
              "flex items-center space-x-3",
              collapsed && "justify-center"
            )}
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs sm:text-sm font-medium">
                {user ? getInitials(user.username) : "U"}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
