import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Typography,
  Avatar,
  Tooltip,
  Spin,
  Empty,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";
import { useAuth, useDebounce } from "../../hooks";
import { format } from "date-fns";
import type { GetAllUsersQuery, UserWithoutPassword } from "../../types";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // State for filters and pagination
  const [filters, setFilters] = useState<GetAllUsersQuery>({
    search: "",
    role: undefined,
    sortBy: "createdAt",
    sortOrder: "DESC",
    limit: 10,
    offset: 0,
  });

  // Debounced search for better performance
  const debouncedSearch = useDebounce(filters.search, 500);

  // API hooks
  const [deleteUser] = useDeleteUserMutation();

  // Query parameters with debounced search
  const queryParams: GetAllUsersQuery = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch]
  );

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery(queryParams, {
    skip: !isAdmin(), // Only fetch if user is admin
    refetchOnMountOrArgChange: true,
  });

  // Debug logging
  useEffect(() => {
    console.log("Users API Filters being sent:", queryParams);
  }, [queryParams]);

  useEffect(() => {
    console.log("Users API Response:", { usersData, isLoading });
  }, [usersData, isLoading]);

  // Manual refetch when filters change
  useEffect(() => {
    const currentQueryParams = { ...filters, search: debouncedSearch };
    console.log("Users Filters changed:", currentQueryParams);
    console.log("Users API call should be triggered with:", currentQueryParams);
    refetch();
  }, [filters, debouncedSearch, refetch]);

  const users = usersData?.users || [];
  const total = usersData?.total || 0;

  // Handle delete user
  const handleDelete = async (userId: string, username: string) => {
    try {
      const result = await Modal.confirm({
        title: "Delete User",
        content: `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
      });

      // If user confirmed, proceed with deletion
      if (result) {
        try {
          await deleteUser(userId).unwrap();
          refetch();
        } catch (error: any) {
          console.error("Delete error:", error);
        }
      }
    } catch (error) {
      console.error("Modal error:", error);
    }
  };

  // Table columns
  const columns: ColumnsType<UserWithoutPassword> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <span className="text-white font-semibold">
              {record.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900 text-sm sm:text-base">
              {record.username}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role: "user" | "admin") => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "User", value: "user" },
        { text: "Admin", value: "admin" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      responsive: ["md"],
      render: (date: string) => (
        <Tooltip title={format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}>
          <Text className="text-xs sm:text-sm">
            {format(new Date(date), "MMM dd, yyyy")}
          </Text>
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      responsive: ["lg"],
      render: (date: string) => (
        <Tooltip title={format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}>
          <Text className="text-xs sm:text-sm">
            {format(new Date(date), "MMM dd, yyyy")}
          </Text>
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/users/${record.id}`)}
              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/users/${record.id}/edit`)}
              className="text-green-600 hover:text-green-800 text-xs sm:text-sm"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ef4444" }} />}
              onClick={() => handleDelete(record.id, record.username)}
              className="text-xs sm:text-sm hover:bg-red-50"
              size="small"
              style={{ color: "#ef4444" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Handler functions
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, offset: 0 }));
  };

  const handleRoleFilter = (value: "user" | "admin" | undefined) => {
    setFilters((prev) => ({ ...prev, role: value, offset: 0 }));
  };

  const handleSortBy = (
    value: "username" | "email" | "createdAt" | "updatedAt"
  ) => {
    setFilters((prev) => ({ ...prev, sortBy: value, offset: 0 }));
  };

  const handleSortOrder = (value: "ASC" | "DESC") => {
    setFilters((prev) => ({ ...prev, sortOrder: value, offset: 0 }));
  };

  const handlePageSize = (value: number) => {
    setFilters((prev) => ({ ...prev, limit: value, offset: 0 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      role: undefined,
      sortBy: "createdAt",
      sortOrder: "DESC",
      limit: 10,
      offset: 0,
    });
  };

  // Handle table changes
  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    const currentOffset = filters.offset || 0;
    const currentLimit = filters.limit || 10;

    if (pagination.current !== Math.floor(currentOffset / currentLimit) + 1) {
      setFilters((prev) => ({
        ...prev,
        offset: (pagination.current - 1) * (prev.limit || 10),
      }));
    }
    if (pagination.pageSize !== currentLimit) {
      setFilters((prev) => ({
        ...prev,
        limit: pagination.pageSize,
        offset: 0,
      }));
    }

    // Handle sorting
    if (sorter.field) {
      setFilters((prev) => ({
        ...prev,
        sortBy: sorter.field,
        sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
        offset: 0,
      }));
    }
  };

  // Show access denied for non-admin users
  if (!isAdmin()) {
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

        <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
          <div className="glass-card rounded-lg sm:rounded-xl p-6 sm:p-8 border border-white/30">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚫</div>
              <Title level={3} className="text-gray-800 mb-4">
                Access Denied
              </Title>
              <Text className="text-gray-600 text-base">
                You don't have permission to view this page. Admin access
                required.
              </Text>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Animated background with floating orbs */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header Section */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                👥 Users Management
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Manage system users and their permissions
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                loading={isLoading}
                className="h-10 sm:h-12 px-4 sm:px-6 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/users/create")}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: "linear-gradient(to right, #2563eb, #9333ea)",
                  border: "none",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #1d4ed8, #7c3aed)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #2563eb, #9333ea)";
                }}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Full-Width Filters Section */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="space-y-4">
            {/* Full-Width Search Bar */}
            <div className="w-full">
              <Search
                placeholder="Search users by username or email..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                enterButton={
                  <Button
                    icon={<SearchOutlined />}
                    className="h-full text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{
                      background: "linear-gradient(to right, #2563eb, #9333ea)",
                      border: "none",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, #1d4ed8, #7c3aed)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, #2563eb, #9333ea)";
                    }}
                  >
                    Search
                  </Button>
                }
                allowClear
                size="large"
                className="w-full"
                style={{ width: "100%" }}
              />
            </div>

            {/* Filters Row - Full Width */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="w-full">
                <Select
                  placeholder="Filter by Role"
                  value={filters.role}
                  onChange={handleRoleFilter}
                  allowClear
                  size="large"
                  className="w-full"
                >
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </div>

              <div className="w-full">
                <Select
                  placeholder="Sort by Field"
                  value={filters.sortBy}
                  onChange={handleSortBy}
                  size="large"
                  className="w-full"
                >
                  <Option value="username">Username</Option>
                  <Option value="email">Email</Option>
                  <Option value="createdAt">Created Date</Option>
                  <Option value="updatedAt">Updated Date</Option>
                </Select>
              </div>

              <div className="w-full">
                <Select
                  value={filters.sortOrder}
                  onChange={handleSortOrder}
                  size="large"
                  className="w-full"
                >
                  <Option value="ASC">Ascending</Option>
                  <Option value="DESC">Descending</Option>
                </Select>
              </div>

              <div className="w-full xs:col-span-2 sm:col-span-1">
                <Button
                  onClick={handleClearFilters}
                  size="large"
                  className="w-full bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200"
                >
                  <span className="hidden sm:inline">Clear All Filters</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              </div>

              <div className="w-full xs:col-span-2 sm:col-span-3 lg:col-span-1">
                <Select
                  placeholder="Page Size"
                  value={filters.limit}
                  onChange={handlePageSize}
                  size="large"
                  className="w-full"
                >
                  <Option value={10}>10 per page</Option>
                  <Option value={20}>20 per page</Option>
                  <Option value={50}>50 per page</Option>
                  <Option value={100}>100 per page</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12 sm:py-16">
                <Spin size="large" />
              </div>
            ) : !users.length ? (
              <div className="text-center py-12 sm:py-16">
                <Empty
                  description="No users found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/users/create")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                  >
                    Create Your First User
                  </Button>
                </Empty>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={users}
                  loading={isLoading}
                  rowKey="id"
                  pagination={{
                    current:
                      Math.floor(
                        (filters.offset || 0) / (filters.limit || 10)
                      ) + 1,
                    pageSize: filters.limit || 10,
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} users`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    responsive: true,
                    size: "default",
                    className: "users-pagination",
                  }}
                  onChange={handleTableChange}
                  className="users-table"
                  scroll={{ x: 800 }}
                  size="middle"
                  rowClassName="hover:bg-white/30 transition-colors duration-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
