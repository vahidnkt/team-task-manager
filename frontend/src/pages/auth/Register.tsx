import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../hooks";
import {
  registerSchema,
  type RegisterFormData,
} from "../../utils/validationSchemas";
import { ROUTES } from "../../router";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password field for real-time validation
  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Redirect to login page with success message
        navigate(ROUTES.LOGIN, {
          state: {
            message:
              "Account created successfully! Please check your email to verify your account.",
          },
        });
      } else {
        // Handle registration errors
        if (result.error?.includes("Email already exists")) {
          setError("email", {
            type: "manual",
            message: "An account with this email already exists.",
          });
        } else if (result.error?.includes("Username already exists")) {
          setError("username", {
            type: "manual",
            message: "This username is already taken.",
          });
        } else {
          setError("root", {
            type: "manual",
            message: result.error || "Registration failed. Please try again.",
          });
        }
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <Input
                {...register("username")}
                type="text"
                label="Username"
                placeholder="Choose a username"
                error={errors.username?.message}
                autoComplete="username"
                required
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            {/* Email Field */}
            <div>
              <Input
                {...register("email")}
                type="email"
                label="Email address"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
                required
                className="w-full"
              />
            </div>

            {/* Password Field */}
            <div>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Create a password"
                error={errors.password?.message}
                autoComplete="new-password"
                required
                className="w-full"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                Must contain at least 8 characters with uppercase, lowercase,
                and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                required
                className="w-full"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                }
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.root.message}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting || isLoading}
            loading={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? "Creating account..."
              : "Create account"}
          </Button>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            Password Requirements:
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
