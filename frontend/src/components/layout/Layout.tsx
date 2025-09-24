import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "../../utils/helpers";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen relative flex overflow-hidden">
      {/* Animated background with floating orbs - same as Login page */}
      <div className="animated-background fixed inset-0 z-0">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Sidebar - Fixed full height with glassmorphism */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 transition-all duration-300 ease-in-out lg:relative",
          // Mobile: high z-index when open, normal when closed
          mobileMenuOpen ? "z-50" : "z-30",
          // Desktop: normal z-index
          "lg:z-30",
          // Mobile behavior - no width when hidden to prevent space reservation
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-0",
          // Desktop behavior - always visible, just width changes
          "lg:translate-x-0",
          // Dynamic width based on collapsed state for desktop
          sidebarCollapsed ? "lg:w-16" : "lg:w-64",
          "h-full relative" // Remove fixed width for mobile
        )}
      >
        <div className="absolute inset-0 glass-card border-r border-white/30" />
        <div className="relative z-10 h-full">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>
      </div>

      {/* Mobile backdrop - subtle glassmorphism overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 transition-all duration-300 lg:hidden",
          mobileMenuOpen
            ? "bg-white/10 backdrop-blur-sm pointer-events-auto"
            : "bg-transparent pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 h-full overflow-hidden relative transition-all duration-300 ease-in-out",
          // Mobile: full width when sidebar is hidden, disabled when sidebar is open
          "w-full lg:flex-1",
          // Mobile: disable interactions when sidebar is open
          mobileMenuOpen
            ? "lg:z-20 pointer-events-none"
            : "z-20 pointer-events-auto",
          // Desktop: no margin needed since sidebar is relative positioned
          "lg:ml-0"
        )}
      >
        {/* Header with glassmorphism */}
        <div className="relative z-10">
          <div className="absolute inset-0 glass-card border-b border-white/30" />
          <div className="relative z-10">
            <Header
              onMenuClick={toggleMobileMenu}
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={toggleSidebar}
              mobileMenuOpen={mobileMenuOpen}
            />
          </div>
        </div>

        {/* Page Content */}
        <main className={cn("flex-1 overflow-auto h-full", className)}>
          <div className="p-4 lg:p-6 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Layout variants for different page types
export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout className="bg-gray-50">
      <div className="max-w-7xl mx-auto">{children}</div>
    </Layout>
  );
};

export const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Task Manager
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FullWidthLayout: React.FC<LayoutProps> = ({
  children,
  className,
}) => {
  return <Layout className={cn("bg-white", className)}>{children}</Layout>;
};
