import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Spin,
  Alert,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  FlagOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "../../store/api/tasksApi";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { ROUTES } from "../../utils/constants";
import type { UpdateTaskRequest } from "../../types";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const {
    data: task,
    isLoading: isLoadingTask,
    error: taskError,
  } = useGetTaskQuery(id!);
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery({
    limit: 100, // Get more users for the dropdown
    offset: 0,
    sortBy: "username",
    sortOrder: "ASC",
  });
  const users = usersData?.users || [];
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        assignee_id: task.assigneeId,
        priority: task.priority,
        due_date: task.dueDate ? dayjs(task.dueDate) : undefined,
      });
    }
  }, [task, form]);

  const handleCancel = () => {
    navigate(ROUTES.TASK_DETAIL(id!));
  };

  const onFinish = async (values: any) => {
    try {
      const updateData: UpdateTaskRequest = {
        title: values.title,
        description: values.description,
        assignee_id: values.assignee_id,
        priority: values.priority,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      };

      await updateTask({
        id: id!,
        data: updateData,
      }).unwrap();

      message.success("Task updated successfully!");
      navigate(ROUTES.TASK_DETAIL(id!));
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update task");
    }
  };

  if (isLoadingTask || isLoadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="text-center py-12">
        <Alert
          message="Error"
          description="Failed to load task details"
          type="error"
          showIcon
        />
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <Alert
          message="Not Found"
          description="Task not found"
          type="warning"
          showIcon
        />
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

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
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-white/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200"
              size="large"
            >
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                ✏️ Edit Task
              </h1>
              <p className="text-sm sm:text-base text-gray-800">
                Update task details
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
            <Form
              form={form}
              name="editTask"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
            >
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Task Title
                  </span>
                }
                name="title"
                rules={[
                  { required: true, message: "Please enter task title!" },
                  { min: 1, message: "Task title cannot be empty!" },
                  {
                    max: 255,
                    message: "Task title must be less than 255 characters!",
                  },
                ]}
              >
                <Input
                  placeholder="✨ Enter your task title..."
                  className="h-10 sm:h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">📋</span>
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
                  placeholder="📝 Describe your task goals, requirements, and any important details..."
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <UserOutlined />
                      Assignee
                    </span>
                  }
                  name="assignee_id"
                >
                  <Select
                    placeholder="Select assignee (optional)"
                    allowClear
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                  >
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span>{user.username}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <FlagOutlined />
                      Priority
                    </span>
                  }
                  name="priority"
                >
                  <Select className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm">
                    <Option value="low">
                      <Tag color="green">Low</Tag>
                    </Option>
                    <Option value="medium">
                      <Tag color="orange">Medium</Tag>
                    </Option>
                    <Option value="high">
                      <Tag color="red">High</Tag>
                    </Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <CalendarOutlined />
                    Due Date
                  </span>
                }
                name="due_date"
              >
                <DatePicker
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                  placeholder="Select due date (optional)"
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
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
                    {isUpdating ? "Updating..." : "Update Task"}
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

export default EditTask;
