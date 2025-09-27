/**
 * Activity utility functions for consistent activity display across the application
 */

/**
 * Get activity icon based on action type
 * @param action - The activity action type
 * @returns Emoji icon string
 */
export const getActivityIcon = (action: string): string => {
  switch (action) {
    case "task_created":
      return "📝";
    case "task_updated":
      return "✏️";
    case "task_deleted":
      return "🗑️";
    case "task_assigned":
      return "👤";
    case "task_unassigned":
      return "👤❌";
    case "status_changed":
      return "🔄";
    case "comment_added":
      return "💬";
    case "comment_updated":
      return "✏️💬";
    case "comment_deleted":
      return "🗑️💬";
    case "project_created":
      return "📁";
    case "project_updated":
      return "✏️📁";
    case "project_completed":
      return "✅📁";
    case "project_deleted":
      return "🗑️📁";
    case "user_registered":
      return "👤";
    case "user_profile_updated":
      return "✏️👤";
    case "user_logged_in":
      return "🔑";
    case "system_alert":
      return "⚠️";
    default:
      return "📋";
  }
};

/**
 * Get activity title based on action type
 * @param action - The activity action type
 * @returns Human-readable title string
 */
export const getActivityTitle = (action: string): string => {
  switch (action) {
    case "task_created":
      return "Task Created";
    case "task_updated":
      return "Task Updated";
    case "task_deleted":
      return "Task Deleted";
    case "status_changed":
      return "Status Changed";
    case "task_assigned":
      return "Task Assigned";
    case "task_unassigned":
      return "Task Unassigned";
    case "comment_added":
      return "Comment Added";
    case "comment_updated":
      return "Comment Updated";
    case "comment_deleted":
      return "Comment Deleted";
    case "project_created":
      return "Project Created";
    case "project_updated":
      return "Project Updated";
    case "project_completed":
      return "Project Completed";
    case "project_deleted":
      return "Project Deleted";
    case "user_registered":
      return "User Registered";
    case "user_profile_updated":
      return "Profile Updated";
    case "user_logged_in":
      return "User Logged In";
    case "system_alert":
      return "System Alert";
    default:
      return "Activity";
  }
};

/**
 * Get activity color based on action type for badges/tags
 * @param action - The activity action type
 * @returns Color string for Ant Design Tag component
 */
export const getActivityColor = (action: string): string => {
  switch (action) {
    case "task_created":
    case "project_created":
    case "user_registered":
      return "blue";
    case "task_updated":
    case "project_updated":
    case "user_profile_updated":
      return "orange";
    case "task_deleted":
    case "project_deleted":
    case "comment_deleted":
      return "red";
    case "status_changed":
    case "project_completed":
      return "green";
    case "task_assigned":
      return "purple";
    case "task_unassigned":
      return "gray";
    case "comment_added":
    case "comment_updated":
      return "cyan";
    case "user_logged_in":
      return "default";
    case "system_alert":
      return "red";
    default:
      return "default";
  }
};

/**
 * Get activity description with context
 * @param action - The activity action type
 * @param context - Additional context (task title, project name, etc.)
 * @returns Formatted description string
 */
export const getActivityDescription = (
  action: string,
  context?: {
    taskTitle?: string;
    projectName?: string;
    userName?: string;
    oldStatus?: string;
    newStatus?: string;
  }
): string => {
  const { taskTitle, projectName, userName, oldStatus, newStatus } =
    context || {};

  switch (action) {
    case "task_created":
      return `Task "${taskTitle || "Unknown"}" was created${
        projectName ? ` in project "${projectName}"` : ""
      }`;
    case "task_updated":
      return `Task "${taskTitle || "Unknown"}" was updated`;
    case "task_deleted":
      return `Task "${taskTitle || "Unknown"}" was deleted`;
    case "status_changed":
      return `Task "${taskTitle || "Unknown"}" status changed from "${
        oldStatus || "unknown"
      }" to "${newStatus || "unknown"}"`;
    case "task_assigned":
      return `Task "${taskTitle || "Unknown"}" was assigned to ${
        userName || "user"
      }`;
    case "task_unassigned":
      return `Task "${taskTitle || "Unknown"}" was unassigned`;
    case "comment_added":
      return `Comment added to task "${taskTitle || "Unknown"}"`;
    case "comment_updated":
      return `Comment updated on task "${taskTitle || "Unknown"}"`;
    case "comment_deleted":
      return `Comment deleted from task "${taskTitle || "Unknown"}"`;
    case "project_created":
      return `Project "${projectName || "Unknown"}" was created`;
    case "project_updated":
      return `Project "${projectName || "Unknown"}" was updated`;
    case "project_completed":
      return `Project "${projectName || "Unknown"}" was completed`;
    case "project_deleted":
      return `Project "${projectName || "Unknown"}" was deleted`;
    case "user_registered":
      return `User "${userName || "Unknown"}" registered`;
    case "user_profile_updated":
      return `Profile updated for user "${userName || "Unknown"}"`;
    case "user_logged_in":
      return `User "${userName || "Unknown"}" logged in`;
    case "system_alert":
      return "System alert triggered";
    default:
      return "Activity occurred";
  }
};

/**
 * Check if activity is related to a specific entity
 * @param activity - Activity object
 * @param entityType - Type of entity to check
 * @param entityId - ID of the entity
 * @returns Boolean indicating if activity is related
 */
export const isActivityRelated = (
  activity: any,
  entityType: "project" | "task" | "user",
  entityId: string
): boolean => {
  switch (entityType) {
    case "project":
      return activity.projectId === entityId;
    case "task":
      return activity.taskId === entityId;
    case "user":
      return activity.userId === entityId;
    default:
      return false;
  }
};

/**
 * Filter activities by action type
 * @param activities - Array of activities
 * @param action - Action type to filter by
 * @returns Filtered activities array
 */
export const filterActivitiesByAction = (
  activities: any[],
  action: string
): any[] => {
  return activities.filter((activity) => activity.action === action);
};

/**
 * Sort activities by creation date
 * @param activities - Array of activities
 * @param order - Sort order (asc or desc)
 * @returns Sorted activities array
 */
export const sortActivitiesByDate = (
  activities: any[],
  order: "asc" | "desc" = "desc"
): any[] => {
  return [...activities].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Get activity statistics
 * @param activities - Array of activities
 * @returns Statistics object
 */
export const getActivityStats = (activities: any[]) => {
  const stats = {
    total: activities.length,
    byAction: {} as Record<string, number>,
    byUser: {} as Record<string, number>,
    byProject: {} as Record<string, number>,
    recent: 0,
  };

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  activities.forEach((activity) => {
    // Count by action
    stats.byAction[activity.action] =
      (stats.byAction[activity.action] || 0) + 1;

    // Count by user
    if (activity.userId) {
      stats.byUser[activity.userId] = (stats.byUser[activity.userId] || 0) + 1;
    }

    // Count by project
    if (activity.projectId) {
      stats.byProject[activity.projectId] =
        (stats.byProject[activity.projectId] || 0) + 1;
    }

    // Count recent activities (last 24 hours)
    if (new Date(activity.createdAt) > oneDayAgo) {
      stats.recent++;
    }
  });

  return stats;
};
