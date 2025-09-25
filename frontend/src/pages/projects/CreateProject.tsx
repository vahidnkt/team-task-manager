import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useCreateProjectMutation } from "../../store/api/projectsApi";
import type { CreateProjectRequest } from "../../types";
import { ROUTES } from "../../router";

const { TextArea } = Input;

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const onFinish = async (values: CreateProjectRequest) => {
    try {
      const result = await createProject(values).unwrap();
      message.success("Project created successfully!");
      navigate(ROUTES.PROJECT_DETAIL(result.id));
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create project");
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROJECTS);
  };

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

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex items-center gap-4 mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700"
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                ✨ Create New Project
              </h1>
              <p className="text-base sm:text-lg text-gray-800">
                Set up a new project to organize your tasks and team
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
            <Form
              form={form}
              name="createProject"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
            >
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
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
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Description</span>
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
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<SaveOutlined />}
                    className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                  >
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none h-10 sm:h-12 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium transition-all duration-200 text-sm sm:text-base"
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

export default CreateProject;
