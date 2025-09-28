import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Divider,
  Avatar,
  Descriptions,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SafetyOutlined,
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
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Text>Loading profile...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load profile. Please try again."
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

  const userProfile = profile || currentUser;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} className="!mb-2">
            My Profile
          </Title>
          <Text className="text-gray-600">
            Manage your account information and settings
          </Text>
        </div>
      </div>

      {/* Profile Overview Card */}
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
                  {userProfile?.username}
                </Title>
                <div className="flex items-center gap-2 mb-2">
                  <MailOutlined className="text-gray-500" />
                  <Text className="text-gray-600">{userProfile?.email}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Tag
                    color={userProfile?.role === "admin" ? "red" : "blue"}
                    icon={
                      userProfile?.role === "admin" ? (
                        <SafetyOutlined />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  >
                    {userProfile?.role?.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <div className="text-center">
                  <Text strong className="block">
                    Account Created
                  </Text>
                  <Text className="text-gray-600">
                    {userProfile?.created_at
                      ? format(new Date(userProfile.created_at), "MMM dd, yyyy")
                      : "Not available"}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="text-center">
                  <Text strong className="block">
                    Last Updated
                  </Text>
                  <Text className="text-gray-600">
                    {userProfile?.updated_at
                      ? format(new Date(userProfile.updated_at), "MMM dd, yyyy")
                      : "Not available"}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="text-center">
                  <Text strong className="block">
                    User ID
                  </Text>
                  <Text code className="text-xs">
                    {userProfile?.id || "Not available"}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Profile Information */}
        <Col xs={24}>
          <Card
            title="Profile Information"
            extra={
              !isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Space>
                  <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => profileForm.submit()}
                    loading={isUpdating}
                  >
                    Save Changes
                  </Button>
                </Space>
              )
            }
          >
            {!isEditing ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Username">
                  <Text code>{userProfile?.username}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text>{userProfile?.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={userProfile?.role === "admin" ? "red" : "blue"}>
                    {userProfile?.role?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
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
              >
                <Form.Item
                  name="username"
                  label="Username"
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
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
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
                  />
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>

      {/* Help Text */}
      <Card className="mt-6">
        <Alert
          message="Profile Management Guidelines"
          description={
            <div className="text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Username must be unique and contain only letters, numbers, and
                  underscores
                </li>
                <li>Email address must be unique and valid</li>
                <li>
                  Profile changes will be reflected immediately after saving
                </li>
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default Profile;
