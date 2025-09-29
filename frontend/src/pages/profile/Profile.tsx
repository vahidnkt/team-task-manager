import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Row,
  Col,
  Divider,
  Avatar,
  Descriptions,
  Tag,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SafetyOutlined,
  CalendarOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../store/api/authApi";
import { useAuth } from "../../hooks";
import { format } from "date-fns";

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm] = Form.useForm();

  const { data: profile, isLoading, error, refetch } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Handle profile update
  const handleProfileUpdate = async (values: any) => {
    try {
      await updateProfile(values).unwrap();
      setIsEditing(false);
      profileForm.resetFields();
      refetch();
    } catch (error: any) {
      console.error("Profile update error:", error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    profileForm.resetFields();
  };

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
          <div className="text-center">
            <Spin size="large" className="mb-4" />
            <Text className="text-gray-700">Loading profile...</Text>
          </div>
        </div>
      </>
    );
  }

  if (error) {
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
            description="Failed to load profile. Please try again."
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

  const userProfile = profile || currentUser;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                👤 My Profile
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Manage your account information and settings
              </p>
            </div>
          </div>
        </div>

        {/* Profile Overview Card */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar
              size={{ xs: 80, sm: 100, md: 120 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {userProfile?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </Avatar>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <Title level={3} className="!mb-2 text-gray-900">
                    {userProfile?.username}
                  </Title>
                  <div className="flex items-center gap-2 mb-3">
                    <MailOutlined className="text-gray-500" />
                    <Text className="text-gray-600 text-sm sm:text-base">
                      {userProfile?.email}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag
                      color={userProfile?.role === "admin" ? "red" : "blue"}
                      icon={
                        userProfile?.role === "admin" ? (
                          <CrownOutlined />
                        ) : (
                          <UserOutlined />
                        )
                      }
                    >
                      {userProfile?.role?.toUpperCase()}
                    </Tag>
                    <Tag color="green" icon={<SafetyOutlined />}>
                      Current User
                    </Tag>
                  </div>
                </div>
              </div>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <CalendarOutlined className="text-blue-600 text-lg mb-2" />
                    <Text strong className="block text-sm sm:text-base">
                      Account Created
                    </Text>
                    <Text className="text-gray-600 text-xs sm:text-sm">
                      {userProfile?.created_at
                        ? format(
                            new Date(userProfile.created_at),
                            "MMM dd, yyyy"
                          )
                        : "Not available"}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <CalendarOutlined className="text-green-600 text-lg mb-2" />
                    <Text strong className="block text-sm sm:text-base">
                      Last Updated
                    </Text>
                    <Text className="text-gray-600 text-xs sm:text-sm">
                      {userProfile?.updated_at
                        ? format(
                            new Date(userProfile.updated_at),
                            "MMM dd, yyyy"
                          )
                        : "Not available"}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <UserOutlined className="text-purple-600 text-lg mb-2" />
                    <Text strong className="block text-sm sm:text-base">
                      User ID
                    </Text>
                    <Text code className="text-xs">
                      {userProfile?.id?.slice(0, 8) + "..." || "Not available"}
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="glass-card rounded-lg sm:rounded-xl border border-white/30">
          <div className="p-4 sm:p-6 border-b border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                📝 Profile Information
              </h3>
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
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
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleCancelEdit}
                    icon={<CloseOutlined />}
                    className="h-10 sm:h-12 px-4 sm:px-6 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => profileForm.submit()}
                    loading={isUpdating}
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
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {!isEditing ? (
              <Descriptions
                column={{ xs: 1, sm: 1, md: 1 }}
                size="small"
                className="profile-descriptions"
              >
                <Descriptions.Item label="Username">
                  <Text code className="text-sm sm:text-base">
                    {userProfile?.username}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text className="text-sm sm:text-base">
                    {userProfile?.email}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={userProfile?.role === "admin" ? "red" : "blue"}>
                    {userProfile?.role?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                {/* <Descriptions.Item label="Full User ID">
                  <Text code className="text-xs break-all">
                    {userProfile?.id || "Not available"}
                  </Text>
                </Descriptions.Item> */}
              </Descriptions>
            ) : (
              <Form
                form={profileForm}
                layout="vertical"
                initialValues={{
                  username: userProfile?.username,
                  email: userProfile?.email,
                }}
                onFinish={handleProfileUpdate}
                className="profile-edit-form"
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
                    className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </Form.Item>
              </Form>
            )}
          </div>
        </div>

        {/* User Statistics */}
        {userProfile?.statistics && (
          <div className="glass-card mt-4 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/30 mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">
              📈 Your Statistics
            </h4>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">📁</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {userProfile.statistics.projectsCreated || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Projects Created
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {userProfile.statistics.tasksAssigned || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Tasks Assigned
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-lg font-semibold text-green-600">
                    {userProfile.statistics.tasksCompleted || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Tasks Completed
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {userProfile.statistics.commentsMade || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Comments Made
                  </div>
                </div>
              </Col>
            </Row>

            {/* Additional Statistics Row */}
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="text-lg font-semibold text-cyan-600">
                    {userProfile.statistics.activeProjects || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Active Projects
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">🏁</div>
                  <div className="text-lg font-semibold text-emerald-600">
                    {userProfile.statistics.completedProjects || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Completed Projects
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {userProfile.statistics.inProgressTasks || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    In Progress Tasks
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                  <div className="text-2xl mb-2">⚠️</div>
                  <div className="text-lg font-semibold text-red-600">
                    {userProfile.statistics.overdueTasks || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Overdue Tasks
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Help Text */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/30 mt-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">ℹ️</div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Profile Management Guidelines
              </h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  • Username must be unique and contain only letters, numbers,
                  and underscores
                </p>
                <p>• Email address must be unique and valid</p>
                <p>
                  • Profile changes will be reflected immediately after saving
                </p>
                <p>• Your role cannot be changed from this profile page</p>
                <p>
                  • Contact an administrator if you need to update your role or
                  permissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
