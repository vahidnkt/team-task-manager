import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useCreateUserMutation } from "../../store/api/usersApi";
import { useAuth } from "../../hooks";
// Toast messages are handled by middleware
import type { CreateUserRequest } from "../../types";

const { Title, Text } = Typography;

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  // Toast messages are handled by middleware

  const [form] = Form.useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();

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
              You don't have permission to create users. Admin access required.
            </Text>
            <div className="mt-4">
              <Button onClick={() => navigate("/users")}>Back to Users</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    try {
      // Remove confirmPassword from payload and set default role
      const { confirmPassword, ...userData } = values;
      const payload: CreateUserRequest = {
        ...userData,
        role: "user", // Default role is user
      };

      await createUser(payload).unwrap();
      // Toast message is handled by middleware
      navigate("/users");
    } catch (error) {
      // Error toast is handled by middleware
    }
  };

  const handleCancel = () => {
    navigate("/users");
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
            Create New User
          </Title>
          <Text className="text-gray-600">Add a new user to the system</Text>
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
              className="create-user-form"
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

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter a password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Space className="w-full justify-end">
                  <Button onClick={handleCancel} size="large">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    size="large"
                  >
                    Create User
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
            message="User Creation Guidelines"
            description={
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Username must be unique and contain only letters, numbers,
                    and underscores
                  </li>
                  <li>Email address must be unique and valid</li>
                  <li>
                    Password must be at least 6 characters with uppercase,
                    lowercase, and number
                  </li>
                  <li>Confirm password must match the password above</li>
                  <li>New users will be created with "user" role by default</li>
                  <li>
                    Regular users have limited access to their own data and
                    assigned tasks
                  </li>
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

export default CreateUser;
