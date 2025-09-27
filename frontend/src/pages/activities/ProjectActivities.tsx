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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: activitiesResponse,
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useGetProjectActivitiesQuery(
    {
      projectId: projectId!,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
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

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const handleRefresh = () => {
    refetchActivities();
    if (showStats) {
      refetchStats();
    }
  };

  if (!projectId) {
    return (
      <div className="text-center py-8">
        <Empty
          description="Project ID is required"
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
          Failed to load project activities
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
          <h3 className="text-lg font-semibold text-gray-900">
            Project Activities
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
      {showStats && statsData && !isLoadingStats && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <BarChartOutlined />
              <span>Activity Statistics (Last 30 Days)</span>
            </div>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total Activities"
                value={statsData.total_activities}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Most Active User"
                value={statsData.most_active_users[0]?.username || "N/A"}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Task Activities"
                value={
                  statsData.actions_summary.task_created +
                    statsData.actions_summary.task_updated +
                    statsData.actions_summary.task_deleted || 0
                }
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Comments"
                value={statsData.actions_summary.comment_added || 0}
                valueStyle={{ color: "#722ed1" }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Empty
          description="No activities found for this project"
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
                showProject={false} // Don't show project since we're already in project context
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

export default ProjectActivities;
