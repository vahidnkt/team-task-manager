import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { List, Spin, Empty, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import { useGetTaskActivitiesQuery } from "../../store/api/activitiesApi";
import type { Activity } from "../../types/activity.types";

interface TaskActivitiesProps {
  onActivityClick?: (activity: Activity) => void;
}

const TaskActivities: React.FC<TaskActivitiesProps> = ({ onActivityClick }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 5; // Start with 5 items

  const {
    data: activitiesResponse,
    isLoading,
    error,
    refetch,
  } = useGetTaskActivitiesQuery(
    {
      taskId: taskId!,
      limit: limit,
      offset: currentOffset,
    },
    {
      skip: !taskId,
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

  if (!taskId) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-8">
          <Empty
            description="Task ID is required"
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
            Failed to load task activities
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
      {/* Header */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              📝 Task Activities
            </h3>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              size="small"
              className="text-gray-500 hover:text-gray-700 bg-white/60 hover:bg-white/80"
            />
          </div>
        </div>
      </div>

      {/* Activities List with Infinite Scroll */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        {allActivities.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Empty
              description="No activities found for this task"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div
            className="space-y-2 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
            style={{ scrollbarWidth: "thin" }}
          >
            {allActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showProject={true}
                showTask={false} // Don't show task since we're already in task context
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
            {!hasMore && allActivities.length > 0 && (
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

export default TaskActivities;
