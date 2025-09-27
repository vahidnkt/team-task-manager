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
        <span>
          <GlobalOutlined />
          Recent Activities
        </span>
      ),
      children: (
        <ActivityFeed limit={50} onActivityClick={handleActivityClick} />
      ),
    },
    {
      key: "my",
      label: (
        <span>
          <UserOutlined />
          My Activities
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
      {/* Animated background */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                📊 Activities
              </h1>
              <p className="text-sm sm:text-base text-gray-800">
                Track and monitor all system activities, user actions, and
                project progress
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                size="large"
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="hidden sm:inline">Analytics</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Activities Tabs */}
        <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={visibleTabs}
            size="large"
            className="p-4 sm:p-6"
            tabBarStyle={{
              marginBottom: "24px",
              borderBottom: "1px solid #f0f0f0",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Activities;
