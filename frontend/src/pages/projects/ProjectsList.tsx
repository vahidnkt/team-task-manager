import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Input,
  Select,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Spin,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../store/api/projectsApi";
import { formatRelativeTime } from "../../utils/dateUtils";
import type { Project, GetProjectsQuery } from "../../types";

const { Search } = Input;
const { Option } = Select;

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // State for filters and pagination
  const [filters, setFilters] = useState<GetProjectsQuery>({
    search: "",
    status: undefined,
    priority: undefined,
    limit: 10,
    offset: 0,
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  // API hooks
  const {
    data: projectsData,
    isLoading,
    error,
    refetch,
  } = useGetProjectsQuery(filters);

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Handle search
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, offset: 0 }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof GetProjectsQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  // Handle table pagination
  const handleTableChange = (
    pagination: any,
    _tableFilters: any,
    sorter: any
  ) => {
    const newOffset = (pagination.current - 1) * pagination.pageSize;
    setFilters((prev) => ({
      ...prev,
      offset: newOffset,
      limit: pagination.pageSize,
      sortBy: sorter.field || "created_at",
      sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
    }));
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId).unwrap();
      message.success("Project deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete project");
    }
  };

  // Table columns with responsive design
  const columns: ColumnsType<Project> = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "25%",
      render: (name: string, record: Project) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">{name}</div>
          {record.description && (
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Creator",
      dataIndex: ["creator", "username"],
      key: "creator",
      width: "15%",
      responsive: ["sm"],
      render: (username: string) => (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
            {username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-gray-700 text-xs sm:text-sm truncate hidden sm:inline">
            {username || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      title: "Tasks",
      key: "tasks",
      width: "15%",
      responsive: ["md"],
      render: (record: Project) => {
        const taskCount = record.tasks?.length || 0;
        const completedTasks =
          record.tasks?.filter((t) => t.status === "done").length || 0;
        const progressPercentage =
          taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

        return (
          <div className="text-center">
            <div className="text-sm sm:text-lg font-semibold text-gray-900">
              {taskCount}
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              {completedTasks} completed ({progressPercentage}%)
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (record: Project) => {
        let status = "Active";
        let color = "default";

        if (record.status === "completed") {
          status = "Completed";
          color = "success";
        } else if (record.status === "on_hold") {
          status = "On Hold";
          color = "warning";
        } else {
          // For active projects, show progress-based status
          const taskCount = record.tasks?.length || 0;
          const completedTasks =
            record.tasks?.filter((t) => t.status === "done").length || 0;

          if (taskCount > 0) {
            if (completedTasks === taskCount) {
              status = "Ready to Complete";
              color = "processing";
            } else if (completedTasks > 0) {
              status = "In Progress";
              color = "processing";
            } else {
              status = "Active";
              color = "default";
            }
          } else {
            status = "Active";
            color = "default";
          }
        }

        return (
          <Tag color={color} className="text-xs sm:text-sm">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: "15%",
      responsive: ["lg"],
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <span className="text-gray-600 text-xs sm:text-sm">
            {formatRelativeTime(date)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (record: Project) => (
        <Space size="small" direction="vertical" className="sm:flex-row">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(ROUTES.PROJECT_DETAIL(record.id))}
              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
              size="small"
            />
          </Tooltip>
          {isAdmin() && (
            <>
              <Tooltip title="Edit Project">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => navigate(ROUTES.EDIT_PROJECT(record.id))}
                  className="text-green-600 hover:text-green-800 text-xs sm:text-sm"
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Delete Project">
                <Popconfirm
                  title="Are you sure you want to delete this project?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDeleteProject(record.id)}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: isDeleting }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
                    loading={isDeleting}
                    size="small"
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

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
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                📁 Projects
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Manage and track all your projects
              </p>
            </div>
            {isAdmin() && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate(ROUTES.CREATE_PROJECT)}
                size="large"
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create Project
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-white/30">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <Search
                placeholder="Search projects by name or description..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="w-full"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <div className="flex-1 xs:flex-none">
                <Select
                  placeholder="Status"
                  allowClear
                  size="large"
                  className="w-full xs:w-auto"
                  style={{ minWidth: 120 }}
                  onChange={(value) => handleFilterChange("status", value)}
                >
                  <Option value="active">Active</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="on_hold">On Hold</Option>
                </Select>
              </div>
              <div className="flex-1 xs:flex-none">
                <Select
                  placeholder="Priority"
                  allowClear
                  size="large"
                  className="w-full xs:w-auto"
                  style={{ minWidth: 120 }}
                  onChange={(value) => handleFilterChange("priority", value)}
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </div>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                size="large"
                className="w-full xs:w-auto bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700"
              >
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
          <div className="p-2 sm:p-4 lg:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Spin size="large" />
              </div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-red-500 text-base sm:text-lg mb-4">
                  Failed to load projects
                </div>
                <Button onClick={() => refetch()} type="primary">
                  Try Again
                </Button>
              </div>
            ) : !projectsData?.projects?.length ? (
              <Empty
                description="No projects found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {isAdmin() && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(ROUTES.CREATE_PROJECT)}
                  >
                    Create Your First Project
                  </Button>
                )}
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={projectsData.projects}
                  rowKey="id"
                  pagination={{
                    current: Math.floor(filters.offset! / filters.limit!) + 1,
                    pageSize: filters.limit,
                    total: projectsData.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} projects`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    responsive: true,
                    size: "small",
                    className: "responsive-pagination",
                  }}
                  onChange={handleTableChange}
                  className="projects-table"
                  scroll={{ x: 600 }}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsList;
