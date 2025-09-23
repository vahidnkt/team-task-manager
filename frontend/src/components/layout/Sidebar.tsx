import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import {
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  User,
  Calendar,
  MessageSquare,
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
  badge?: string | number;
}

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
    badge: 5,
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
      {
        id: "task-board",
        label: "Task Board",
        icon: <BarChart3 className="h-4 w-4" />,
        path: "/tasks/board",
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: <Users className="h-5 w-5" />,
    path: "/team",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className="h-5 w-5" />,
    path: "/calendar",
  },
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare className="h-5 w-5" />,
    path: "/messages",
    badge: 3,
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity className="h-5 w-5" />,
    path: "/activity",
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
        path: "/admin/users",
        permission: "users:read",
      },
      {
        id: "reports",
        label: "Reports",
        icon: <BarChart3 className="h-4 w-4" />,
        path: "/admin/reports",
        permission: "users:read",
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

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
    if (item.permission && !hasPermission(item.permission as any)) {
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
            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            isActive && "bg-blue-500/30 text-blue-200",
            !isActive && "text-white",
            level > 0 && "ml-4"
          )}
        >
          <div className="flex items-center space-x-3">
            <span className={cn("flex-shrink-0", level > 0 && "h-4 w-4")}>
              {item.icon}
            </span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </div>

          <div className="flex items-center space-x-2">
            {item.badge && !collapsed && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500/80 rounded-full border border-red-400/30">
                {item.badge}
              </span>
            )}
            {hasChildren && !collapsed && (
              <span className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-white/70" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/70" />
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
        "transition-all duration-300 h-screen flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="flex items-center px-4 py-4 border-b border-white/30">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-white">
                Task Manager
              </h2>
              <p className="text-xs text-white/70">Project Management</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/30 p-4">
          <div
            className={cn(
              "flex items-center space-x-3",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-medium">
                {user ? getInitials(user.username) : "U"}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-white/70 truncate">
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
