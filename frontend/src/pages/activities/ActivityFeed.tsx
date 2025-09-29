// import React, { useState } from "react";
// import { List, Spin, Empty, Button, Pagination, Select } from "antd";
// import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
// import ActivityCard from "./ActivityCard";
// import { useGetRecentActivitiesQuery } from "../../store/api/activitiesApi";
// import type { ActivityAction } from "../../types/activity.types";
// import { useAuth } from "../../hooks";

// interface ActivityFeedProps {
//   limit?: number;
//   showProject?: boolean;
//   showTask?: boolean;
//   onActivityClick?: (activity: any) => void;
// }

// const ActivityFeed: React.FC<ActivityFeedProps> = ({
//   limit = 20,
//   showProject = true,
//   showTask = true,
//   onActivityClick,
// }) => {
//   const { isAdmin } = useAuth();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(limit);
//   const [filterAction, setFilterAction] = useState<ActivityAction | "all">(
//     "all"
//   );

//   const {
//     data: activitiesResponse,
//     isLoading,
//     error,
//     refetch,
//   } = useGetRecentActivitiesQuery(
//     {
//       limit: pageSize,
//       offset: (currentPage - 1) * pageSize,
//     },
//     {
//       skip: !isAdmin(), // Only admins can see recent activities
//     }
//   );

//   const activities = activitiesResponse?.activities || [];
//   const total = activitiesResponse?.total || 0;

//   const handlePageChange = (page: number, size?: number) => {
//     setCurrentPage(page);
//     if (size) {
//       setPageSize(size);
//     }
//   };

//   const handleRefresh = () => {
//     refetch();
//   };

//   const handleFilterChange = (value: ActivityAction | "all") => {
//     setFilterAction(value);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   // Filter activities based on selected action
//   const filteredActivities =
//     filterAction === "all"
//       ? activities
//       : activities.filter((activity) => activity.action === filterAction);

//   const actionOptions = [
//     { value: "all", label: "All Activities" },
//     { value: "task_created", label: "Task Created" },
//     { value: "task_updated", label: "Task Updated" },
//     { value: "task_deleted", label: "Task Deleted" },
//     { value: "status_changed", label: "Status Changed" },
//     { value: "task_assigned", label: "Task Assigned" },
//     { value: "task_unassigned", label: "Task Unassigned" },
//     { value: "comment_added", label: "Comment Added" },
//     { value: "project_created", label: "Project Created" },
//     { value: "project_updated", label: "Project Updated" },
//     { value: "project_completed", label: "Project Completed" },
//     { value: "project_deleted", label: "Project Deleted" },
//   ];

//   if (!isAdmin()) {
//     return (
//       <div className="text-center py-8">
//         <Empty
//           description="Admin access required to view recent activities"
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//         />
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-red-500 text-lg mb-4">
//           Failed to load activities
//         </div>
//         <Button
//           onClick={handleRefresh}
//           type="primary"
//           icon={<ReloadOutlined />}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header with Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div className="flex items-center gap-2">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Recent Activities
//           </h3>
//           <Button
//             type="text"
//             icon={<ReloadOutlined />}
//             onClick={handleRefresh}
//             size="small"
//             className="text-gray-500 hover:text-gray-700"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <FilterOutlined className="text-gray-500" />
//           <Select
//             value={filterAction}
//             onChange={handleFilterChange}
//             options={actionOptions}
//             size="small"
//             className="min-w-40"
//             placeholder="Filter by action"
//           />
//         </div>
//       </div>

//       {/* Activities List */}
//       {filteredActivities.length === 0 ? (
//         <Empty
//           description="No activities found"
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//           className="py-8"
//         />
//       ) : (
//         <List
//           dataSource={filteredActivities}
//           renderItem={(activity) => (
//             <List.Item key={activity.id} className="!px-0">
//               <ActivityCard
//                 activity={activity}
//                 showProject={showProject}
//                 showTask={showTask}
//                 onActivityClick={onActivityClick}
//               />
//             </List.Item>
//           )}
//           pagination={false}
//         />
//       )}

//       {/* Pagination */}
//       {total > pageSize && (
//         <div className="flex justify-center">
//           <Pagination
//             current={currentPage}
//             pageSize={pageSize}
//             total={total}
//             onChange={handlePageChange}
//             onShowSizeChange={handlePageChange}
//             showSizeChanger
//             showQuickJumper
//             showTotal={(total, range) =>
//               `${range[0]}-${range[1]} of ${total} activities`
//             }
//             pageSizeOptions={["10", "20", "50", "100"]}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActivityFeed;

import React, { useState } from "react";
import { List, Spin, Empty, Button, Pagination, Select } from "antd";
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
  limit = 20,
  showProject = true,
  showTask = true,
  onActivityClick,
}) => {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(limit);
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
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    {
      skip: !isAdmin(), // Only admins can see recent activities
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
    refetch();
  };

  const handleFilterChange = (value: ActivityAction | "all") => {
    setFilterAction(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Filter activities based on selected action
  const filteredActivities =
    filterAction === "all"
      ? activities
      : activities.filter((activity) => activity.action === filterAction);

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

      {/* Activities List */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Empty
              description="No activities found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showProject={showProject}
                showTask={showTask}
                onActivityClick={onActivityClick}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex justify-center mt-6 pt-4 border-t border-white/20">
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
              responsive
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
