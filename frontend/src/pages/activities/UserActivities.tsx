import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty, Button, Statistic, Row, Col } from "antd";
import {
  ReloadOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import {
  useGetUserActivitiesQuery,
  useGetUserActivitySummaryQuery,
} from "../../store/api/activitiesApi";
import type { Activity } from "../../types/activity.types";
import { useAuth } from "../../hooks";

interface UserActivitiesProps {
  showStats?: boolean;
  onActivityClick?: (activity: Activity) => void;
}

const UserActivities: React.FC<UserActivitiesProps> = ({
  showStats = true,
  onActivityClick,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 5; // Start with 5 items

  // Use current user's ID if no userId in params
  const targetUserId = userId || user?.id;

  const {
    data: activitiesResponse,
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useGetUserActivitiesQuery(
    {
      userId: targetUserId!,
      limit: limit,
      offset: currentOffset,
    },
    {
      skip: !targetUserId,
    }
  );

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useGetUserActivitySummaryQuery(
    {
      days: 7,
    },
    {
      skip: !targetUserId || !showStats,
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
    refetchActivities();
    if (showStats) {
      refetchSummary();
    }
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

  if (!targetUserId) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-8">
          <Empty
            description="User ID is required"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  if (isLoadingActivities) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (activitiesError) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-12">
          <div className="text-red-500 text-base sm:text-lg mb-4">
            Failed to load user activities
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
            <UserOutlined className="text-blue-500 text-lg" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {userId ? "User Activities" : "My Activities"}
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

      {/* Statistics */}
      {showStats && summaryData && !isLoadingSummary && (
        <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BarChartOutlined className="text-blue-600" />
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              Activity Summary (Last 7 Days)
            </h4>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Total Activities"
                  value={summaryData.total_activities}
                  valueStyle={{ color: "#1890ff" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Task Activities"
                  value={
                    (summaryData.actions_summary.task_created || 0) +
                    (summaryData.actions_summary.task_updated || 0) +
                    (summaryData.actions_summary.task_deleted || 0)
                  }
                  valueStyle={{ color: "#52c41a" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Comments"
                  value={summaryData.actions_summary.comment_added || 0}
                  valueStyle={{ color: "#faad14" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Project Activities"
                  value={
                    (summaryData.actions_summary.project_created || 0) +
                    (summaryData.actions_summary.project_updated || 0) +
                    (summaryData.actions_summary.project_completed || 0)
                  }
                  valueStyle={{ color: "#722ed1" }}
                />
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Activities List with Infinite Scroll */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        {allActivities.length === 0 && !isLoadingActivities ? (
          <div className="text-center py-12">
            <Empty
              description="No activities found for this user"
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
                showTask={true}
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

export default UserActivities;
