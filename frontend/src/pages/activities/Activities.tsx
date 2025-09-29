import React, { useState } from "react";
import { Tabs, Button } from "antd";
import {
  GlobalOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import ActivityFeed from "./ActivityFeed";
import UserActivities from "./UserActivities";
import { useAuth } from "../../hooks";

const Activities: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");

  const handleActivityClick = (activity: any) => {
    // Handle activity click - could navigate to related task/project
    console.log("Activity clicked:", activity);
  };

  const tabItems = [
    {
      key: "recent",
      label: (
        <span className="flex items-center gap-2 text-sm sm:text-base">
          <GlobalOutlined />
          <span className="hidden xs:inline">Recent Activities</span>
          <span className="xs:hidden">Recent</span>
        </span>
      ),
      children: (
        <ActivityFeed limit={50} onActivityClick={handleActivityClick} />
      ),
    },
    {
      key: "my",
      label: (
        <span className="flex items-center gap-2 text-sm sm:text-base">
          <UserOutlined />
          <span className="hidden xs:inline">My Activities</span>
          <span className="xs:hidden">Mine</span>
        </span>
      ),
      children: (
        <UserActivities
          showStats={true}
          onActivityClick={handleActivityClick}
        />
      ),
    },
  ];

  // Only show recent activities tab for admins
  const visibleTabs = isAdmin() ? tabItems : tabItems.slice(1);

  return (
    <>
      {/* Animated background with floating orbs */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header Section */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                📊 Activities
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Track and monitor all system activities, user actions, and
                project progress
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                size="large"
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: "linear-gradient(to right, #2563eb, #9333ea)",
                  border: "none",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #1d4ed8, #7c3aed)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #2563eb, #9333ea)";
                }}
              >
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Activities Tabs */}
        <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
          <div className="p-4 sm:p-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={visibleTabs}
              size="large"
              className="activities-tabs"
              tabBarStyle={{
                marginBottom: "24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Activities;
