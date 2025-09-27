import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Dropdown,
  Modal,
  Typography,
  Avatar,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";
import { useAuth } from "../../hooks";
// Toast messages are handled by middleware
import { format } from "date-fns";
import type { GetAllUsersQuery, UserWithoutPassword } from "../../types";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  // Toast messages are handled by middleware

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"user" | "admin" | "">("");
  const [sortBy, setSortBy] = useState<
    "username" | "email" | "createdAt" | "updatedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API hooks
  const [deleteUser] = useDeleteUserMutation();

  // Query parameters
  const queryParams: GetAllUsersQuery = useMemo(
    () => ({
      search: searchTerm || undefined,
      role: roleFilter || undefined,
      sortBy,
      sortOrder,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }),
    [searchTerm, roleFilter, sortBy, sortOrder, currentPage, pageSize]
  );

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery(queryParams, {
    skip: !isAdmin(), // Only fetch if user is admin
  });

  const users = usersData?.users || [];
  const total = usersData?.total || 0;

  // Handle delete user
  const handleDelete = async (userId: string, username: string) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(userId).unwrap();
          // Toast message is handled by middleware
          refetch();
        } catch (error) {
          // Error toast is handled by middleware
        }
      },
    });
  };

  // Table columns
  const columns: ColumnsType<UserWithoutPassword> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium text-gray-900">{record.username}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
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
      render: (date: string) => (
        <Tooltip title={format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}>
          <Text className="text-sm">
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
      render: (date: string) => (
        <Tooltip title={format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}>
          <Text className="text-sm">
            {format(new Date(date), "MMM dd, yyyy")}
          </Text>
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <EyeOutlined />,
                onClick: () => navigate(`/users/${record.id}`),
              },
              {
                key: "edit",
                label: "Edit User",
                icon: <EditOutlined />,
                onClick: () => navigate(`/users/${record.id}/edit`),
              },
              {
                key: "delete",
                label: "Delete User",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record.id, record.username),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            className="hover:bg-gray-100"
          />
        </Dropdown>
      ),
    },
  ];

  // Handle table changes
  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    if (pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }

    // Handle sorting
    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    }
  };

  // Show access denied for non-admin users
  if (!isAdmin()) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <div className="py-12">
            <div className="text-6xl mb-4">🚫</div>
            <Title level={3} className="text-gray-600">
              Access Denied
            </Title>
            <Text className="text-gray-500">
              You don't have permission to view this page. Admin access
              required.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Title level={2} className="!mb-2">
            Users Management
          </Title>
          <Text className="text-gray-600">
            Manage system users and their permissions
          </Text>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/users/create")}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Search
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => setSearchTerm(value)}
              enterButton={<SearchOutlined />}
              allowClear
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              allowClear
              className="w-32"
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>

            <Select
              placeholder="Sort by"
              value={sortBy}
              onChange={setSortBy}
              className="w-32"
            >
              <Option value="username">Username</Option>
              <Option value="email">Email</Option>
              <Option value="createdAt">Created</Option>
              <Option value="updatedAt">Updated</Option>
            </Select>

            <Select value={sortOrder} onChange={setSortOrder} className="w-24">
              <Option value="ASC">ASC</Option>
              <Option value="DESC">DESC</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          className="users-table"
        />
      </Card>
    </div>
  );
};

export default UsersList;
