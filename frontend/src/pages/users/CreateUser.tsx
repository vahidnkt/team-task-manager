// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   Form,
//   Input,
//   Button,
//   Typography,
//   Space,
//   Alert,
//   Row,
//   Col,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   UserOutlined,
//   MailOutlined,
//   LockOutlined,
// } from "@ant-design/icons";
// import { useCreateUserMutation } from "../../store/api/usersApi";
// import { useAuth } from "../../hooks";
// // Toast messages are handled by middleware
// import type { CreateUserRequest } from "../../types";

// const { Title, Text } = Typography;

// const CreateUser: React.FC = () => {
//   const navigate = useNavigate();
//   const { isAdmin } = useAuth();
//   // Toast messages are handled by middleware

//   const [form] = Form.useForm();
//   const [createUser, { isLoading }] = useCreateUserMutation();

//   // Show access denied for non-admin users
//   if (!isAdmin()) {
//     return (
//       <div className="p-6">
//         <Card className="text-center">
//           <div className="py-12">
//             <div className="text-6xl mb-4">🚫</div>
//             <Title level={3} className="text-gray-600">
//               Access Denied
//             </Title>
//             <Text className="text-gray-500">
//               You don't have permission to create users. Admin access required.
//             </Text>
//             <div className="mt-4">
//               <Button onClick={() => navigate("/users")}>Back to Users</Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   const handleSubmit = async (values: any) => {
//     try {
//       // Remove confirmPassword from payload and set default role
//       const { confirmPassword, ...userData } = values;
//       const payload: CreateUserRequest = {
//         ...userData,
//         role: "user", // Default role is user
//       };

//       await createUser(payload).unwrap();
//       // Toast message is handled by middleware
//       navigate("/users");
//     } catch (error) {
//       // Error toast is handled by middleware
//     }
//   };

//   const handleCancel = () => {
//     navigate("/users");
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <Button
//           icon={<ArrowLeftOutlined />}
//           onClick={handleCancel}
//           className="flex-shrink-0"
//         >
//           Back
//         </Button>
//         <div>
//           <Title level={2} className="!mb-2">
//             Create New User
//           </Title>
//           <Text className="text-gray-600">Add a new user to the system</Text>
//         </div>
//       </div>

//       {/* Form */}
//       <Row justify="center">
//         <Col xs={24} sm={20} md={16} lg={12} xl={10}>
//           <Card>
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleSubmit}
//               size="large"
//               className="create-user-form"
//             >
//               <Form.Item
//                 name="username"
//                 label="Username"
//                 rules={[
//                   { required: true, message: "Please enter a username" },
//                   { min: 3, message: "Username must be at least 3 characters" },
//                   {
//                     pattern: /^[a-zA-Z0-9_]+$/,
//                     message:
//                       "Username can only contain letters, numbers, and underscores",
//                   },
//                 ]}
//               >
//                 <Input
//                   prefix={<UserOutlined />}
//                   placeholder="Enter username"
//                   autoComplete="username"
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="email"
//                 label="Email Address"
//                 rules={[
//                   { required: true, message: "Please enter an email address" },
//                   {
//                     type: "email",
//                     message: "Please enter a valid email address",
//                   },
//                 ]}
//               >
//                 <Input
//                   prefix={<MailOutlined />}
//                   placeholder="Enter email address"
//                   type="email"
//                   autoComplete="email"
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="password"
//                 label="Password"
//                 rules={[
//                   { required: true, message: "Please enter a password" },
//                   { min: 6, message: "Password must be at least 6 characters" },
//                   {
//                     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                     message:
//                       "Password must contain at least one lowercase letter, one uppercase letter, and one number",
//                   },
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="Enter password"
//                   autoComplete="new-password"
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="confirmPassword"
//                 label="Confirm Password"
//                 dependencies={["password"]}
//                 rules={[
//                   { required: true, message: "Please confirm your password" },
//                   ({ getFieldValue }) => ({
//                     validator(_, value) {
//                       if (!value || getFieldValue("password") === value) {
//                         return Promise.resolve();
//                       }
//                       return Promise.reject(
//                         new Error("The two passwords do not match")
//                       );
//                     },
//                   }),
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="Confirm password"
//                   autoComplete="new-password"
//                 />
//               </Form.Item>

//               <Form.Item className="mb-0">
//                 <Space className="w-full justify-end">
//                   <Button onClick={handleCancel} size="large">
//                     Cancel
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={isLoading}
//                     size="large"
//                   >
//                     Create User
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Form>
//           </Card>
//         </Col>
//       </Row>

//       {/* Help Text */}
//       <Row justify="center" className="mt-6">
//         <Col xs={24} sm={20} md={16} lg={12} xl={10}>
//           <Alert
//             message="User Creation Guidelines"
//             description={
//               <div className="text-sm">
//                 <ul className="list-disc list-inside space-y-1">
//                   <li>
//                     Username must be unique and contain only letters, numbers,
//                     and underscores
//                   </li>
//                   <li>Email address must be unique and valid</li>
//                   <li>
//                     Password must be at least 6 characters with uppercase,
//                     lowercase, and number
//                   </li>
//                   <li>Confirm password must match the password above</li>
//                   <li>New users will be created with "user" role by default</li>
//                   <li>
//                     Regular users have limited access to their own data and
//                     assigned tasks
//                   </li>
//                 </ul>
//               </div>
//             }
//             type="info"
//             showIcon
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default CreateUser;
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
import type { CreateUserRequest } from "../../types";

const { Title, Text } = Typography;

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [form] = Form.useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();

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
                You don't have permission to create users. Admin access
                required.
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

  const handleSubmit = async (values: any) => {
    try {
      // Remove confirmPassword from payload and set default role
      const { confirmPassword, ...userData } = values;
      const payload: CreateUserRequest = {
        ...userData,
        role: "user", // Default role is user
      };

      await createUser(payload).unwrap();
      navigate("/users");
    } catch (error) {
      // Error handling is done by middleware
    }
  };

  const handleCancel = () => {
    navigate("/users");
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
                👤 Create New User
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Add a new user to the system
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
                className="create-user-form"
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

                <Form.Item
                  name="password"
                  label={
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Password
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter a password" },
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
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Confirm Password
                    </span>
                  }
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
                    className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
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
                      {isLoading ? "Creating User..." : "Create User"}
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
                    User Creation Guidelines
                  </h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      • Username must be unique and contain only letters,
                      numbers, and underscores
                    </p>
                    <p>• Email address must be unique and valid</p>
                    <p>
                      • Password must be at least 6 characters with uppercase,
                      lowercase, and number
                    </p>
                    <p>• Confirm password must match the password above</p>
                    <p>
                      • New users will be created with "user" role by default
                    </p>
                    <p>
                      • Regular users have limited access to their own data and
                      assigned tasks
                    </p>
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

export default CreateUser;
