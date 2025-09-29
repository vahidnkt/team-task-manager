import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty, Button, Statistic, Row, Col } from "antd";
import { ReloadOutlined, BarChartOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import {
  useGetProjectActivitiesQuery,
  useGetProjectActivityStatsQuery,
} from "../../store/api/activitiesApi";
import type { Activity } from "../../types/activity.types";

interface ProjectActivitiesProps {
  showStats?: boolean;
  onActivityClick?: (activity: Activity) => void;
}

const ProjectActivities: React.FC<ProjectActivitiesProps> = ({
  showStats = true,
  onActivityClick,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 5; // Start with 5 items

  const {
    data: activitiesResponse,
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useGetProjectActivitiesQuery(
    {
      projectId: projectId!,
      limit: limit,
      offset: currentOffset,
    },
    {
      skip: !projectId,
    }
  );

  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetProjectActivityStatsQuery(
    {
      projectId: projectId!,
      days: 30,
    },
    {
      skip: !projectId || !showStats,
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
      refetchStats();
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

  if (!projectId) {
    return (
      <div className="glass-card rounded-lg p-6 sm:p-8 border border-white/30">
        <div className="text-center py-8">
          <Empty
            description="Project ID is required"
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
            Failed to load project activities
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
              📁 Project Activities
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
      {showStats && statsData && !isLoadingStats && (
        <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BarChartOutlined className="text-blue-600" />
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              Activity Statistics (Last 30 Days)
            </h4>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Total Activities"
                  value={statsData.total_activities}
                  valueStyle={{ color: "#1890ff" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Most Active User"
                  value={statsData.most_active_users[0]?.username || "N/A"}
                  valueStyle={{ color: "#52c41a" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Task Activities"
                  value={
                    statsData.actions_summary.task_created +
                      statsData.actions_summary.task_updated +
                      statsData.actions_summary.task_deleted || 0
                  }
                  valueStyle={{ color: "#faad14" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <Statistic
                  title="Comments"
                  value={statsData.actions_summary.comment_added || 0}
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
              description="No activities found for this project"
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
                showProject={false} // Don't show project since we're already in project context
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

export default ProjectActivities;
