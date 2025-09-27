import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Spin,
  Empty,
  Button,
  Pagination,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
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

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const handleRefresh = () => {
    refetchActivities();
    if (showStats) {
      refetchSummary();
    }
  };

  if (!targetUserId) {
    return (
      <div className="text-center py-8">
        <Empty
          description="User ID is required"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  if (isLoadingActivities) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (activitiesError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">
          Failed to load user activities
        </div>
        <Button
          onClick={handleRefresh}
          type="primary"
          icon={<ReloadOutlined />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {userId ? "User Activities" : "My Activities"}
          </h3>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size="small"
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
      </div>

      {/* Statistics */}
      {showStats && summaryData && !isLoadingSummary && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <BarChartOutlined />
              <span>Activity Summary (Last 7 Days)</span>
            </div>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total Activities"
                value={summaryData.total_activities}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Task Activities"
                value={
                  (summaryData.actions_summary.task_created || 0) +
                  (summaryData.actions_summary.task_updated || 0) +
                  (summaryData.actions_summary.task_deleted || 0)
                }
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Comments"
                value={summaryData.actions_summary.comment_added || 0}
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Project Activities"
                value={
                  (summaryData.actions_summary.project_created || 0) +
                  (summaryData.actions_summary.project_updated || 0) +
                  (summaryData.actions_summary.project_completed || 0)
                }
                valueStyle={{ color: "#722ed1" }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Empty
          description="No activities found for this user"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-8"
        />
      ) : (
        <List
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item key={activity.id} className="!px-0">
              <ActivityCard
                activity={activity}
                showProject={true}
                showTask={true}
                onActivityClick={onActivityClick}
              />
            </List.Item>
          )}
          pagination={false}
        />
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} activities`
            }
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </div>
  );
};

export default UserActivities;
