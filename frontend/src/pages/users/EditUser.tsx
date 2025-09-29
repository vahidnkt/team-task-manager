import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Spin,
  Divider,
  Alert,
  Space,
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
import type { UpdateProfileRequest } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();

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
                You don't have permission to edit this user's profile.
              </Text>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/users")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Back to Users
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </div>
      </>
    );
  }

  // Error state
  if (error || !user) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Alert
            message="Error"
            description="Failed to load user details. Please try again."
            type="error"
            showIcon
            action={
              <Button
                size="small"
                onClick={() => refetch()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
              >
                Retry
              </Button>
            }
          />
        </div>
      </>
    );
  }

  const handleSubmit = async (values: UpdateProfileRequest) => {
    try {
      await updateUser({ id: user.id, data: values }).unwrap();
      navigate(isOwnProfile ? "/profile" : "/users");
    } catch (error) {
      // Error handling is done by middleware
    }
  };

  const handleCancel = () => {
    navigate(isOwnProfile ? "/profile" : "/users");
  };

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
          <div className="flex items-center gap-4 mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200"
              size="large"
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                ✏️ {isOwnProfile ? "Edit Profile" : "Edit User"}
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                {isOwnProfile
                  ? "Update your profile information"
                  : `Update information for ${user.username}`}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-white/30">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                className="edit-user-form"
              >
                <Form.Item
                  name="username"
                  label={
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Username
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter a username" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters",
                    },
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
                    className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Email Address
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter an email address",
                    },
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
                    className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </Form.Item>

                {/* Role field - only for admins editing other users */}
                {isAdmin() && !isOwnProfile && (
                  <Form.Item
                    name="role"
                    label={
                      <span className="text-gray-700 font-medium text-sm sm:text-base">
                        Role
                      </span>
                    }
                    rules={[
                      { required: true, message: "Please select a role" },
                    ]}
                  >
                    <Select
                      placeholder="Select user role"
                      className="role-select"
                      size="large"
                    >
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
                    <Divider className="my-6">
                      <span className="text-gray-700 font-medium">
                        Change Password (Optional)
                      </span>
                    </Divider>

                    <Form.Item
                      name="currentPassword"
                      label={
                        <span className="text-gray-700 font-medium text-sm sm:text-base">
                          Current Password
                        </span>
                      }
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
                        className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label={
                        <span className="text-gray-700 font-medium text-sm sm:text-base">
                          New Password
                        </span>
                      }
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
                        className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    </Form.Item>
                  </>
                )}

                <Form.Item className="mb-0 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isUpdating}
                      className="flex-1 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(to right, #2563eb, #9333ea)",
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
                      {isUpdating
                        ? "Updating..."
                        : isOwnProfile
                        ? "Update Profile"
                        : "Update User"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium transition-all duration-200 text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>

        {/* Help Text */}
        <Row justify="center" className="mt-6">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <div className="glass-card rounded-lg p-4 sm:p-6 border border-white/30">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 text-lg">ℹ️</div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                    {isOwnProfile
                      ? "Profile Update Guidelines"
                      : "User Update Guidelines"}
                  </h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    {isOwnProfile ? (
                      <>
                        <p>
                          • Username must be unique and contain only letters,
                          numbers, and underscores
                        </p>
                        <p>• Email address must be unique and valid</p>
                        <p>
                          • Leave password fields empty if you don't want to
                          change your password
                        </p>
                        <p>
                          • Current password is required when changing your
                          password
                        </p>
                        <p>
                          • New password must be at least 6 characters with
                          uppercase, lowercase, and number
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          • Username must be unique and contain only letters,
                          numbers, and underscores
                        </p>
                        <p>• Email address must be unique and valid</p>
                        <p>
                          • Role determines the user's permissions in the system
                        </p>
                        <p>
                          • Admin users have full system access and can manage
                          other users
                        </p>
                        <p>
                          • Regular users have limited access to their own data
                          and assigned tasks
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditUser;
