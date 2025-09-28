import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Tag,
  Avatar,
  Modal,
  Spin,
  Alert,
  Divider,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CrownOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  useGetUserQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";
import { useAuth } from "../../hooks";
// Toast messages are handled by middleware
import { format, formatDistanceToNow } from "date-fns";

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  // Toast messages are handled by middleware

  const [deleteUser] = useDeleteUserMutation();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(id!, {
    skip: !id,
  });

  // Check if current user can view this user's details
  const canView = isAdmin() || currentUser?.id === id;
  const canEdit = isAdmin() || currentUser?.id === id;
  const canDelete = isAdmin() && currentUser?.id !== id; // Admin can't delete themselves

  // Handle delete user
  const handleDelete = async () => {
    if (!user) return;

    try {
      const result = await Modal.confirm({
        title: "Delete User",
        content: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
      });

      // If user confirmed, proceed with deletion
      if (result) {
        try {
          await deleteUser(user.id).unwrap();
          // Toast message is handled by middleware
          navigate("/users");
        } catch (error: any) {
          // Error toast is handled by middleware
          console.error("Delete error:", error);
        }
      }
    } catch (error) {
      console.error("Modal error:", error);
    }
  };

  // Show access denied if user can't view this profile
  if (!canView) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <div className="py-12">
            <div className="text-6xl mb-4">🚫</div>
            <Title level={3} className="text-gray-600">
              Access Denied
            </Title>
            <Text className="text-gray-500">
              You don't have permission to view this user's profile.
            </Text>
            <div className="mt-4">
              <Button onClick={() => navigate("/users")}>Back to Users</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load user details. Please try again."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <div className="py-12">
            <div className="text-6xl mb-4">👤</div>
            <Title level={3} className="text-gray-600">
              User Not Found
            </Title>
            <Text className="text-gray-500">
              The user you're looking for doesn't exist or has been deleted.
            </Text>
            <div className="mt-4">
              <Button onClick={() => navigate("/users")}>Back to Users</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            className="flex-shrink-0"
          >
            Back
          </Button>
          <div>
            <Title level={2} className="!mb-2">
              User Details
            </Title>
            <Text className="text-gray-600">
              View and manage user information
            </Text>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/users/${user.id}/edit`)}
            >
              Edit User
            </Button>
          ) : null}
          {canDelete ? (
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              Delete User
            </Button>
          ) : null}
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            className="bg-blue-500 flex-shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div>
                <Title level={3} className="!mb-2">
                  {user.username}
                </Title>
                <div className="flex items-center gap-2 mb-2">
                  <MailOutlined className="text-gray-500" />
                  <Text className="text-gray-600">{user.email}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Tag
                    color={user.role === "admin" ? "red" : "blue"}
                    icon={
                      user.role === "admin" ? (
                        <CrownOutlined />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  >
                    {user.role.toUpperCase()}
                  </Tag>
                  {currentUser?.id === user.id && (
                    <Tag color="green" icon={<SafetyOutlined />}>
                      Current User
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="Account Created"
                  value={format(new Date(user.createdAt), "MMM dd, yyyy")}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="Last Updated"
                  value={format(new Date(user.updatedAt), "MMM dd, yyyy")}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="User ID"
                  value={user.id}
                  valueStyle={{ fontSize: "14px" }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Detailed Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Account Information" className="h-full">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Username">
                <Text code>{user.username}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text>{user.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={user.role === "admin" ? "red" : "blue"}>
                  {user.role.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <Text code className="text-xs">
                  {user.id}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Timeline" className="h-full">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Account Created">
                <div>
                  <Text>
                    {format(
                      new Date(user.createdAt),
                      "MMM dd, yyyy 'at' h:mm a"
                    )}
                  </Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                <div>
                  <Text>
                    {format(
                      new Date(user.updatedAt),
                      "MMM dd, yyyy 'at' h:mm a"
                    )}
                  </Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {formatDistanceToNow(new Date(user.updatedAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </div>
              </Descriptions.Item>
              {user.deletedAt && (
                <Descriptions.Item label="Deleted At">
                  <Text type="danger">
                    {format(
                      new Date(user.deletedAt),
                      "MMM dd, yyyy 'at' h:mm a"
                    )}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* User Statistics (Placeholder for future implementation) */}
      <Card title="User Statistics" className="mt-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Projects Created" value={0} suffix="projects" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Tasks Assigned" value={0} suffix="tasks" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Tasks Completed" value={0} suffix="tasks" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Comments Made" value={0} suffix="comments" />
          </Col>
        </Row>
        <div className="mt-4">
          <Text type="secondary" className="text-sm">
            * Statistics will be available in a future update
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default UserDetail;
