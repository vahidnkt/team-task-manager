import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, message, Button, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../router";
import { cn } from "../../utils/helpers";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [form] = Form.useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show success message from registration
  useEffect(() => {
    const registrationMessage = location.state?.message;
    if (registrationMessage) {
      message.success(registrationMessage);
    }
  }, [location.state]);

  const onFinish = async (values: LoginFormData) => {
    try {
      const result = await login(values);

      if (result.success) {
        message.success("Login successful!");
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        if (result.error?.includes("Invalid credentials")) {
          message.error("Invalid email or password. Please try again.");
        } else if (result.error?.includes("Account not verified")) {
          message.error("Please verify your email before logging in.");
        } else {
          message.error(result.error || "Login failed. Please try again.");
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
          "w-full max-w-md auth-card rounded-3xl p-8",
          "animate-slide-in transform transition-all duration-300"
        )}
      >
        <div className="space-y-8 w-full">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
              TM
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to continue to TaskMaster
            </p>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-blue-500" />}
                placeholder="Enter your email address"
                autoComplete="email"
                size="large"
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Enter your password"
                autoComplete="current-password"
                size="large"
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                className="w-full h-12 bg-brand-gradient hover:bg-brand-gradient-hover border-none rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <div className="text-center pt-6 border-t border-gray-200/50">
            <p className="text-gray-600 text-sm mb-4">
              Don't have an account?
            </p>
            <Link to={ROUTES.REGISTER}>
              <Button
                type="default"
                className="w-full h-11 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                size="large"
              >
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
