import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Spin,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../store/api/usersApi";
import { useAuth } from "../../hooks";
// Toast messages are handled by middleware
import type { UpdateProfileRequest } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  // Toast messages are handled by middleware

  const [form] = Form.useForm();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(id!, {
    skip: !id,
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
  }, [user, form]);

  // Check permissions
  const canEdit = isAdmin() || currentUser?.id === id;
  const isOwnProfile = currentUser?.id === id;

  // Show access denied if user can't edit this profile
  if (!canEdit) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <div className="py-12">
            <div className="text-6xl mb-4">🚫</div>
            <Title level={3} className="text-gray-600">
              Access Denied
            </Title>
            <Text className="text-gray-500">
              You don't have permission to edit this user's profile.
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
  if (error || !user) {
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

  const handleSubmit = async (values: UpdateProfileRequest) => {
    try {
      await updateUser({ id: user.id, data: values }).unwrap();
      // Toast message is handled by middleware
      navigate(isOwnProfile ? "/profile" : "/users");
    } catch (error) {
      // Error toast is handled by middleware
    }
  };

  const handleCancel = () => {
    navigate(isOwnProfile ? "/profile" : "/users");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          className="flex-shrink-0"
        >
          Back
        </Button>
        <div>
          <Title level={2} className="!mb-2">
            {isOwnProfile ? "Edit Profile" : "Edit User"}
          </Title>
          <Text className="text-gray-600">
            {isOwnProfile
              ? "Update your profile information"
              : `Update information for ${user.username}`}
          </Text>
        </div>
      </div>

      {/* Form */}
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
              className="edit-user-form"
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter a username" },
                  { min: 3, message: "Username must be at least 3 characters" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter an email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                  type="email"
                  autoComplete="email"
                />
              </Form.Item>

              {/* Role field - only for admins editing other users */}
              {isAdmin() && !isOwnProfile && (
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select placeholder="Select user role">
                    <Option value="user">
                      <Space>
                        <UserOutlined />
                        User
                      </Space>
                    </Option>
                    <Option value="admin">
                      <Space>
                        <CrownOutlined />
                        Admin
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              )}

              {/* Password change section - only for own profile */}
              {isOwnProfile && (
                <>
                  <Divider>Change Password (Optional)</Divider>

                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                      {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item className="mb-0">
                <Space className="w-full justify-end">
                  <Button onClick={handleCancel} size="large">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    size="large"
                  >
                    {isOwnProfile ? "Update Profile" : "Update User"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Help Text */}
      <Row justify="center" className="mt-6">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Alert
            message={
              isOwnProfile
                ? "Profile Update Guidelines"
                : "User Update Guidelines"
            }
            description={
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  {isOwnProfile ? (
                    <>
                      <li>
                        Username must be unique and contain only letters,
                        numbers, and underscores
                      </li>
                      <li>Email address must be unique and valid</li>
                      <li>
                        Leave password fields empty if you don't want to change
                        your password
                      </li>
                      <li>
                        Current password is required when changing your password
                      </li>
                      <li>
                        New password must be at least 6 characters with
                        uppercase, lowercase, and number
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        Username must be unique and contain only letters,
                        numbers, and underscores
                      </li>
                      <li>Email address must be unique and valid</li>
                      <li>
                        Role determines the user's permissions in the system
                      </li>
                      <li>
                        Admin users have full system access and can manage other
                        users
                      </li>
                      <li>
                        Regular users have limited access to their own data and
                        assigned tasks
                      </li>
                    </>
                  )}
                </ul>
              </div>
            }
            type="info"
            showIcon
          />
        </Col>
      </Row>
    </div>
  );
};

export default EditUser;
