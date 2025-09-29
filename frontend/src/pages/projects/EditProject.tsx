import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Spin, Alert } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
} from "../../store/api/projectsApi";
import type { UpdateProjectRequest } from "../../types";
import { ROUTES } from "../../router";

const { TextArea } = Input;

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // API hooks
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProjectQuery(id!);

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Set form values when project data is loaded
  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
      });
    }
  }, [project, form]);

  const onFinish = async (values: UpdateProjectRequest) => {
    try {
      await updateProject({ id: id!, data: values }).unwrap();
      message.success("Project updated successfully!");
      navigate(ROUTES.PROJECT_DETAIL(id!));
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update project");
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROJECT_DETAIL(id!));
  };

  if (isLoadingProject) {
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

  if (projectError) {
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
            message="Error Loading Project"
            description="Failed to load project details. Please try again."
            type="error"
            showIcon
            action={
              <Button
                size="small"
                onClick={() => window.location.reload()}
                className="text-white border-none"
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
                Retry
              </Button>
            }
          />
        </div>
      </>
    );
  }

  if (!project) {
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
            message="Project Not Found"
            description="The project you're looking for doesn't exist or has been deleted."
            type="warning"
            showIcon
            action={
              <Button
                size="small"
                onClick={() => navigate(ROUTES.PROJECTS)}
                className="text-white border-none"
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
                Back to Projects
              </Button>
            }
          />
        </div>
      </>
    );
  }

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
                ✏️ Edit Project
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Update project details and settings
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-white/30">
            <Form
              form={form}
              name="editProject"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
            >
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Project Name
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: "Please enter project name!" },
                  { min: 1, message: "Project name cannot be empty!" },
                  {
                    max: 255,
                    message: "Project name must be less than 255 characters!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter project name"
                  className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Description
                  </span>
                }
                name="description"
                rules={[
                  {
                    max: 1000,
                    message: "Description must be less than 1000 characters!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter project description (optional)"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </Form.Item>

              <Form.Item className="mb-0 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    icon={<SaveOutlined />}
                    className="flex-1 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
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
                    {isUpdating ? "Updating..." : "Update Project"}
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
        </div>
      </div>
    </>
  );
};

export default EditProject;
