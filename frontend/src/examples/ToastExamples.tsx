import React from "react";
import { Button, Space } from "antd";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} from "../store/api/tasksApi";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation
} from "../store/api/projectsApi";
import { useApiMutation } from "../hooks";

/**
 * Example component showing how to use the new automatic toast system
 *
 * All API mutations will automatically show:
 * - Success toasts when the operation succeeds
 * - Error toasts when the operation fails
 *
 * No manual toast calls needed!
 */
const ToastExamples: React.FC = () => {
  const { executeWithLoading, showCustomSuccess } = useApiMutation();

  // Task mutations - all will show automatic toasts
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Project mutations - all will show automatic toasts
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  // Example 1: Simple mutation - automatic toast
  const handleCreateTask = async () => {
    try {
      await createTask({
        title: "New Task",
        description: "Task created via API",
        projectId: "project-123",
        status: "TODO",
        priority: "medium",
      }).unwrap();
      // ✅ Success toast automatically shown: "Task created successfully!"
    } catch (error) {
      // ❌ Error toast automatically shown with backend error message
      console.error("Task creation failed:", error);
    }
  };

  // Example 2: Using executeWithLoading for custom loading states
  const handleCreateProject = async () => {
    const result = await executeWithLoading(
      () => createProject({
        name: "New Project",
        description: "Project created via API",
      }).unwrap(),
      "Creating project...", // Custom loading message
      // Success message will be handled automatically by middleware
    );

    if (result.success) {
      console.log("Project created:", result.data);
      // Additional custom logic here if needed
    }
  };

  // Example 3: Custom success message for special cases
  const handleSpecialUpdate = async () => {
    try {
      await updateTask({
        id: "task-123",
        data: { title: "Updated Task Title" }
      }).unwrap();

      // Show additional custom success message
      showCustomSuccess("Task updated and team notified!");

    } catch (error) {
      // Error toast automatically handled
      console.error("Update failed:", error);
    }
  };

  // Example 4: Multiple operations
  const handleBulkOperations = async () => {
    try {
      // Each operation will show its own toast
      await createTask({ title: "Task 1", projectId: "proj-1" }).unwrap();
      await createTask({ title: "Task 2", projectId: "proj-1" }).unwrap();
      await createTask({ title: "Task 3", projectId: "proj-1" }).unwrap();

      // Show summary message
      showCustomSuccess("All 3 tasks created successfully!");
    } catch (error) {
      // Individual errors will be shown automatically
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Toast Examples</h2>
      <p>All buttons will automatically show success/error toasts via middleware!</p>

      <Space direction="vertical" size="middle">
        <Space wrap>
          <Button type="primary" onClick={handleCreateTask}>
            Create Task (Auto Toast)
          </Button>

          <Button onClick={handleCreateProject}>
            Create Project (With Loading)
          </Button>

          <Button onClick={handleSpecialUpdate}>
            Update with Custom Message
          </Button>
        </Space>

        <Space wrap>
          <Button
            onClick={() => updateProject({ id: "proj-1", data: { name: "Updated" } })}
            type="default"
          >
            Update Project
          </Button>

          <Button
            onClick={() => deleteTask("task-123")}
            danger
          >
            Delete Task
          </Button>

          <Button onClick={handleBulkOperations}>
            Bulk Create Tasks
          </Button>
        </Space>
      </Space>

      <div style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
        <h4>How it works:</h4>
        <ul>
          <li>✅ Success messages: Shown automatically for all mutations (create, update, delete)</li>
          <li>❌ Error messages: Shown automatically with backend error message</li>
          <li>📱 Query errors: Silent by default (login, fetch data, etc.)</li>
          <li>🔄 Loading states: Use <code>useApiMutation</code> for custom loading messages</li>
          <li>🎨 Custom messages: Use <code>showCustomSuccess</code>/<code>showCustomError</code> when needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastExamples;