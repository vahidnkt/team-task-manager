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
    <header className="px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg glass-card border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo/App Name */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <h1 className="text-xl font-semibold text-white hidden sm:block">
            Task Manager
          </h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block md:max-w-md lg:max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 glass-card border border-white/30 rounded-lg"></div>
            <div className="relative">
              <Input
                placeholder="Search tasks, projects..."
                prefix={<Search className="h-4 w-4 text-white/70" />}
                className="w-full bg-transparent border-none text-white placeholder:text-white/70"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Button */}
        <button
          className="md:hidden p-2 rounded-lg glass-card border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg glass-card border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-lg glass-card border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-card border border-white/30 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-white/30">
                <h3 className="text-sm font-medium text-white">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-white/20 hover:bg-white/10 transition-colors">
                  <p className="text-sm text-white">
                    New task assigned to you
                  </p>
                  <p className="text-xs text-white/70">2 hours ago</p>
                </div>
                <div className="p-3 border-b border-white/20 hover:bg-white/10 transition-colors">
                  <p className="text-sm text-white">
                    Project deadline approaching
                  </p>
                  <p className="text-xs text-white/70">4 hours ago</p>
                </div>
                <div className="p-3 hover:bg-white/10 transition-colors">
                  <p className="text-sm text-white">
                    Team member joined project
                  </p>
                  <p className="text-xs text-white/70">1 day ago</p>
                </div>
              </div>
              <div className="p-3 border-t border-white/30">
                <button className="w-full text-sm text-white hover:bg-white/10 py-2 rounded-lg transition-colors">
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
            className="flex items-center space-x-2 px-3 py-2 rounded-lg glass-card border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
          >
            {/* User Avatar */}
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-medium">
                {user ? getInitials(user.username) : "U"}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-white">
              {user?.username}
            </span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card border border-white/30 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-white/30">
                <p className="text-sm font-medium text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-white/70">{user?.email}</p>
                {isAdmin() && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-500/50 text-blue-200 rounded-full border border-blue-300/30">
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
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
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
                    className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Panel
                  </button>
                )}
              </div>

              <div className="py-1 border-t border-white/30">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors"
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
