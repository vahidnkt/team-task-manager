import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import {
  Bell,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { getInitials, cn } from "../../utils/helpers";

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarCollapsed,
  onSidebarToggle,
  mobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme toggle with Tailwind
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="glass-card px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-white/30">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className={cn(
            "lg:hidden p-1.5 sm:p-2 rounded-lg border transition-all duration-300 shadow-sm backdrop-blur-sm",
            mobileMenuOpen
              ? "bg-blue-100 border-blue-300 text-blue-600"
              : "bg-white/60 border-gray-200/50 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex p-1.5 sm:p-2 rounded-lg bg-white/60 border border-gray-200/50 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm backdrop-blur-sm"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${
                sidebarCollapsed ? "rotate-0" : "rotate-180"
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
        )}

        {/* Logo/App Name */}
        {/* <div className="flex items-center space-x-2">
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs sm:text-sm">TM</span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 hidden sm:block">
            Task Manager
          </h1>
        </div> */}

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block md:max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="relative group">
            <Input
              placeholder="Search tasks, projects..."
              prefix={
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
              }
              className="form-input h-9 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md focus:shadow-lg focus:shadow-primary-100/50 border-gray-200/60 hover:border-gray-300/60 focus:border-primary-300 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
        {/* Mobile Search Button */}
        <button className="btn-ghost md:hidden p-1.5 sm:p-2 rounded-lg bg-white/60 border border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm backdrop-blur-sm">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="btn-ghost p-1.5 sm:p-2 rounded-lg bg-white/60 border border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm backdrop-blur-sm"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="btn-ghost p-1.5 sm:p-2 rounded-lg bg-white/60 border border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm backdrop-blur-sm"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="badge badge-error absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 text-xs flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="glass-card absolute right-0 mt-2 w-72 sm:w-80 rounded-lg z-[9999]">
              <div className="p-3 sm:p-4 border-b border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-2 sm:p-3 border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors">
                  <p className="text-xs sm:text-sm text-gray-900">
                    New task assigned to you
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-2 sm:p-3 border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors">
                  <p className="text-xs sm:text-sm text-gray-900">
                    Project deadline approaching
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <div className="p-2 sm:p-3 hover:bg-gray-50/50 transition-colors">
                  <p className="text-xs sm:text-sm text-gray-900">
                    Team member joined project
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="p-2 sm:p-3 border-t border-gray-200/50">
                <button className="w-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50/50 py-2 rounded-lg transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={handleUserMenuClick}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/60 border border-gray-200/50 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm backdrop-blur-sm"
          >
            {/* User Avatar */}
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs sm:text-sm font-medium">
                {user ? getInitials(user.username) : "U"}
              </span>
            </div>
            <span className="hidden md:block text-xs sm:text-sm font-medium text-gray-900">
              {user?.username || "User"}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="glass-card absolute right-0 mt-2 w-48 sm:w-56 rounded-lg z-[9999]">
              <div className="p-3 border-b border-gray-200/50">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
                {isAdmin() && (
                  <span className="badge badge-primary mt-1">Admin</span>
                )}
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                  Settings
                </button>

                {isAdmin() && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                    Admin Panel
                  </button>
                )}
              </div>

              <div className="py-1 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
