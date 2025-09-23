import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Dropdown, Badge } from "antd";
import type { MenuProps } from "antd";
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
import { getInitials } from "../../utils/helpers";

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
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
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Button */}
        <Button
          type="text"
          icon={<Menu className="h-5 w-5" />}
          onClick={onMenuClick}
          className="lg:hidden"
        />

        {/* Logo/App Name */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
            Task Manager
          </h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block md:max-w-md lg:max-w-lg">
          <Input
            placeholder="Search tasks, projects..."
            prefix={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Button */}
        <Button
          type="text"
          icon={<Search className="h-5 w-5" />}
          className="md:hidden"
        />

        {/* Dark Mode Toggle */}
        <Button
          type="text"
          icon={isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          onClick={toggleDarkMode}
        />

        {/* Notifications */}
        <div className="relative">
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<Bell className="h-5 w-5" />}
              onClick={handleNotificationClick}
            />
          </Badge>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm text-gray-900">
                    New task assigned to you
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm text-gray-900">
                    Project deadline approaching
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm text-gray-900">
                    Team member joined project
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200">
                <Button type="text" size="small" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            type="text"
            onClick={handleUserMenuClick}
            className="flex items-center space-x-2 px-3"
          >
            {/* User Avatar */}
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user ? getInitials(user.username) : "U"}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.username}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {isAdmin() && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>

                {isAdmin() && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Panel
                  </button>
                )}
              </div>

              <div className="py-1 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
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
