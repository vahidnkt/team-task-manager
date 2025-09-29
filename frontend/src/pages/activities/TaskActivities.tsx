// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { List, Spin, Empty, Button, Pagination } from "antd";
// import { ReloadOutlined } from "@ant-design/icons";
// import ActivityCard from "./ActivityCard";
// import { useGetTaskActivitiesQuery } from "../../store/api/activitiesApi";
// import type { Activity } from "../../types/activity.types";

// interface TaskActivitiesProps {
//   onActivityClick?: (activity: Activity) => void;
// }

// const TaskActivities: React.FC<TaskActivitiesProps> = ({ onActivityClick }) => {
//   const { taskId } = useParams<{ taskId: string }>();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(20);

//   const {
//     data: activitiesResponse,
//     isLoading,
//     error,
//     refetch,
//   } = useGetTaskActivitiesQuery(
//     {
//       taskId: taskId!,
//       limit: pageSize,
//       offset: (currentPage - 1) * pageSize,
//     },
//     {
//       skip: !taskId,
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

//   if (!taskId) {
//     return (
//       <div className="text-center py-8">
//         <Empty
//           description="Task ID is required"
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
//           Failed to load task activities
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
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Task Activities
//           </h3>
//           <Button
//             type="text"
//             icon={<ReloadOutlined />}
//             onClick={handleRefresh}
//             size="small"
//             className="text-gray-500 hover:text-gray-700"
//           />
//         </div>
//       </div>

//       {/* Activities List */}
//       {activities.length === 0 ? (
//         <Empty
//           description="No activities found for this task"
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//           className="py-8"
//         />
//       ) : (
//         <List
//           dataSource={activities}
//           renderItem={(activity) => (
//             <List.Item key={activity.id} className="!px-0">
//               <ActivityCard
//                 activity={activity}
//                 showProject={true}
//                 showTask={false} // Don't show task since we're already in task context
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

// export default TaskActivities;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { List, Spin, Empty, Button, Pagination } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import { useGetTaskActivitiesQuery } from "../../store/api/activitiesApi";
import type { Activity } from "../../types/activity.types";

interface TaskActivitiesProps {
  onActivityClick?: (activity: Activity) => void;
}

const TaskActivities: React.FC<TaskActivitiesProps> = ({ onActivityClick }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: activitiesResponse,
    isLoading,
    error,
    refetch,
  } = useGetTaskActivitiesQuery(
    {
      taskId: taskId!,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    {
      skip: !taskId,
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

      {/* Activities List */}
      <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Empty
              description="No activities found for this task"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showProject={true}
                showTask={false} // Don't show task since we're already in task context
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

export default TaskActivities;
