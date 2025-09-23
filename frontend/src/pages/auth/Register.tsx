import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, message, Checkbox, Button, Input } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";
import { cn } from "../../utils/helpers";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: RegisterFormData) => {
    try {
      const result = await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        message.success(
          "Account created successfully! Please check your email to verify your account."
        );
        navigate(ROUTES.LOGIN, {
          state: {
            message:
              "Account created successfully! Please check your email to verify your account.",
          },
        });
      } else {
        if (result.error?.includes("Email already exists")) {
          message.error("An account with this email already exists.");
        } else if (result.error?.includes("Username already exists")) {
          message.error("This username is already taken.");
        } else {
          message.error(
            result.error || "Registration failed. Please try again."
          );
        }
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-auto relative">
      {/* Animated background with floating orbs */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      <div
        className={cn(
          "w-full max-w-2xl auth-card rounded-3xl animate-slide-in transform transition-all duration-300",
          isMobile ? "p-6" : "p-8"
        )}
      >
        <div className="space-y-6 w-full">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
              TM
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-base">
              Join TaskMaster to manage your projects
            </p>
          </div>

          {/* Register Form */}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
            className="space-y-4"
          >
            {/* First Row - Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-gray-700 font-medium text-sm">Username</span>}
                name="username"
                rules={[
                  { required: true, message: "Username required!" },
                  {
                    min: 3,
                    message: "Min 3 characters!",
                  },
                  {
                    max: 50,
                    message: "Max 50 characters!",
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "Letters, numbers, underscores only!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-blue-500" />}
                  placeholder="Username"
                  autoComplete="username"
                  size="large"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium text-sm">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: "Email required!" },
                  { type: "email", message: "Valid email required!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-blue-500" />}
                  placeholder="Email address"
                  autoComplete="email"
                  size="large"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>
            </div>

            {/* Second Row - Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-gray-700 font-medium text-sm">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Password required!" },
                  {
                    min: 8,
                    message: "Min 8 characters!",
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Include uppercase, lowercase, number!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-blue-500" />}
                  placeholder="Create password"
                  autoComplete="new-password"
                  size="large"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium text-sm">Confirm Password</span>}
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Confirm password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords don't match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-blue-500" />}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  size="large"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Please accept the terms and conditions!")
                        ),
                },
              ]}
            >
              <Checkbox className="text-gray-700 text-sm">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Privacy Policy
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                className="w-full h-12 bg-brand-gradient hover:bg-brand-gradient-hover border-none rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-gray-200/50">
            <p className="text-gray-600 text-sm mb-4">
              Already have an account?
            </p>
            <Link to={ROUTES.LOGIN}>
              <Button
                type="default"
                className="w-full h-11 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                size="large"
              >
                Sign In Instead
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
