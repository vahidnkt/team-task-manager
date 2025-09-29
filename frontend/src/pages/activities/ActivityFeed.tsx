import React, { useState, useEffect, useCallback } from "react";
import { Spin, Empty, Button, Select } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import { useGetRecentActivitiesQuery } from "../../store/api/activitiesApi";
import type { ActivityAction } from "../../types/activity.types";
import { useAuth } from "../../hooks";

interface ActivityFeedProps {
  limit?: number;
  showProject?: boolean;
  showTask?: boolean;
  onActivityClick?: (activity: any) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  limit = 5, // Start with 5 items
  showProject = true,
  showTask = true,
  onActivityClick,
}) => {
  const { isAdmin } = useAuth();
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterAction, setFilterAction] = useState<ActivityAction | "all">(
    "all"
  );

  const {
    data: activitiesResponse,
    isLoading,
    error,
    refetch,
  } = useGetRecentActivitiesQuery(
    {
      limit: limit,
      offset: currentOffset,
    },
    {
      skip: !isAdmin(), // Only admins can see recent activities
    }
  );

  const activities = activitiesResponse?.activities || [];
  const total = activitiesResponse?.total || 0;

  // Update activities when new data comes in
  useEffect(() => {
    if (activitiesResponse) {
      if (currentOffset === 0) {
        // First load or refresh
        setAllActivities(activities);
      } else {
        // Load more - append to existing activities
        setAllActivities((prev) => [...prev, ...activities]);
      }
      setIsLoadingMore(false);

      // Check if there are more items to load
      setHasMore(allActivities.length + activities.length < total);
    }
  }, [
    activitiesResponse,
    currentOffset,
    activities,
    total,
    allActivities.length,
  ]);

  const handleRefresh = () => {
    setCurrentOffset(0);
    setAllActivities([]);
    setHasMore(true);
    refetch();
  };

  const handleFilterChange = (value: ActivityAction | "all") => {
    setFilterAction(value);
    setCurrentOffset(0);
    setAllActivities([]);
    setHasMore(true);
  };

  // Load more activities
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setCurrentOffset((prev) => prev + limit);
    }
  }, [isLoadingMore, hasMore, limit]);

  // Infinite scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  // Filter activities based on selected action
  const filteredActivities =
    filterAction === "all"
      ? allActivities
      : allActivities.filter((activity) => activity.action === filterAction);

  const actionOptions = [
    { value: "all", label: "All Activities" },
    { value: "task_created", label: "Task Created" },
    { value: "task_updated", label: "Task Updated" },
    { value: "task_deleted", label: "Task Deleted" },
    { value: "status_changed", label: "Status Changed" },
    { value: "task_assigned", label: "Task Assigned" },
    { value: "task_unassigned", label: "Task Unassigned" },
    { value: "comment_added", label: "Comment Added" },
    { value: "project_created", label: "Project Created" },
    { value: "project_updated", label: "Project Updated" },
    { value: "project_completed", label: "Project Completed" },
    { value: "project_deleted", label: "Project Deleted" },
  ];

  if (!isAdmin()) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-8">
          <Empty
            description="Admin access required to view recent activities"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-12">
          <div className="text-red-500 text-base sm:text-lg mb-4">
            Failed to load activities
          </div>
          <Button
            onClick={handleRefresh}
            type="primary"
            icon={<ReloadOutlined />}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Filters */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              size="small"
              className="text-gray-500 hover:text-gray-700 bg-white/60 hover:bg-white/80"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <FilterOutlined className="text-gray-500" />
            <Select
              value={filterAction}
              onChange={handleFilterChange}
              options={actionOptions}
              size="large"
              className="min-w-40 sm:min-w-48"
              placeholder="Filter by action"
            />
          </div>
        </div>
      </div>

      {/* Activities List with Infinite Scroll */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        {filteredActivities.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Empty
              description="No activities found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div
            className="space-y-2 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
            style={{ scrollbarWidth: "thin" }}
          >
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showProject={showProject}
                showTask={showTask}
                onActivityClick={onActivityClick}
              />
            ))}

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Spin size="small" />
                <span className="ml-2 text-gray-500">
                  Loading more activities...
                </span>
              </div>
            )}

            {/* End of List Indicator */}
            {!hasMore && filteredActivities.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                You've reached the end of the activities list
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
