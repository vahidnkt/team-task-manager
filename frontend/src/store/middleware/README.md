# Automatic Toast Middleware

This middleware automatically handles success and error toast messages for all RTK Query API calls using Ant Design's `message` component.

## How It Works

The `toastMiddleware` intercepts all RTK Query actions and automatically shows:

- ✅ **Success toasts** for mutations (create, update, delete operations)
- ❌ **Error toasts** for all failed API calls
- 🔇 **Silent handling** for query operations (GET requests)

## What's Automatic

### Success Messages
These operations automatically show success toasts:
```typescript
// Auth operations
login → "Login successful!"
register → "Account created successfully!"
logout → "Logged out successfully"
updateProfile → "Profile updated successfully"
changePassword → "Password changed successfully"

// Project operations
createProject → "Project created successfully!"
updateProject → "Project updated successfully!"
deleteProject → "Project deleted successfully!"

// Task operations
createTask → "Task created successfully!"
updateTask → "Task updated successfully!"
deleteTask → "Task deleted successfully!"

// User operations
createUser → "User created successfully!"
updateUser → "User updated successfully!"
deleteUser → "User deleted successfully!"

// Comment operations
createComment → "Comment added successfully!"
updateComment → "Comment updated successfully!"
deleteComment → "Comment deleted successfully!"
```

### Error Messages
- All API errors automatically show error toasts
- Backend error messages are used when available
- Fallback to generic messages for unknown errors
- Query operations (GET requests) are silent by default

### Silent Operations
These operations don't show error toasts:
- `getProfile`, `getTasks`, `getProjects`, `getUsers`, `getComments`, `getActivities`

## Usage in Components

### Basic Usage (Recommended)
```typescript
import { useCreateTaskMutation } from "../store/api/tasksApi";

const MyComponent = () => {
  const [createTask] = useCreateTaskMutation();

  const handleCreateTask = async () => {
    try {
      await createTask({
        title: "New Task",
        projectId: "123"
      }).unwrap();

      // ✅ Success toast automatically shown
      // Navigate or update UI here

    } catch (error) {
      // ❌ Error toast automatically shown
      console.error("Failed:", error);
    }
  };

  return <Button onClick={handleCreateTask}>Create Task</Button>;
};
```

### With Custom Loading States
```typescript
import { useApiMutation } from "../hooks";

const MyComponent = () => {
  const { executeWithLoading } = useApiMutation();
  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async () => {
    const result = await executeWithLoading(
      () => createProject({ name: "New Project" }).unwrap(),
      "Creating project...", // Loading message
    );

    if (result.success) {
      // Handle success
    }
    // Error toast shown automatically
  };
};
```

### Custom Messages When Needed
```typescript
import { useApiMutation } from "../hooks";

const MyComponent = () => {
  const { showCustomSuccess, showCustomError } = useApiMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleSpecialUpdate = async () => {
    try {
      await updateTask({ id: "123", data: { title: "Updated" } }).unwrap();

      // Show additional custom message
      showCustomSuccess("Task updated and team notified!");

    } catch (error) {
      // Standard error toast shown automatically
      // Show additional custom error if needed
      showCustomError("Please try again or contact support");
    }
  };
};
```

## Configuration

### Adding New Success Messages
Edit `SUCCESS_MESSAGE_ENDPOINTS` in `toastMiddleware.ts`:
```typescript
const SUCCESS_MESSAGE_ENDPOINTS = {
  // Add new endpoints here
  newOperation: "Custom success message!",
};
```

### Making Operations Silent
Add endpoint names to `SILENT_ENDPOINTS`:
```typescript
const SILENT_ENDPOINTS = new Set([
  "getProfile",
  "newQueryOperation", // Won't show error toasts
]);
```

### Customizing Toast Behavior
Modify the middleware to change:
- Toast duration
- Toast position
- Message format
- Error handling logic

## Migration from Manual Toasts

### Before (Manual)
```typescript
// ❌ Old way - manual toast calls
const handleLogin = async () => {
  try {
    const result = await login(credentials).unwrap();
    message.success("Login successful!");
    navigate("/dashboard");
  } catch (error) {
    message.error("Login failed!");
  }
};
```

### After (Automatic)
```typescript
// ✅ New way - automatic toasts
const handleLogin = async () => {
  try {
    await login(credentials).unwrap();
    // Success toast automatically shown
    navigate("/dashboard");
  } catch (error) {
    // Error toast automatically shown
    console.error("Login failed:", error);
  }
};
```

## Benefits

1. **Consistent UX** - All API operations have consistent toast messaging
2. **Less Boilerplate** - No need to manually add toast calls everywhere
3. **Centralized Control** - Easy to modify toast behavior globally
4. **Better Maintainability** - Toast logic is separated from business logic
5. **Automatic Error Handling** - Backend error messages are automatically displayed