import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

// Permission types
export type Permission =
  | "users:read"
  | "users:write"
  | "users:delete"
  | "projects:read"
  | "projects:write"
  | "projects:delete"
  | "projects:manage_members"
  | "tasks:read"
  | "tasks:write"
  | "tasks:delete"
  | "tasks:assign"
  | "comments:read"
  | "comments:write"
  | "comments:delete"
  | "activities:read"
  | "profile:read"
  | "profile:write";

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    "users:read",
    "users:write",
    "users:delete",
    "projects:read",
    "projects:write",
    "projects:delete",
    "projects:manage_members",
    "tasks:read",
    "tasks:write",
    "tasks:delete",
    "tasks:assign",
    "comments:read",
    "comments:write",
    "comments:delete",
    "activities:read",
    "profile:read",
    "profile:write",
  ],
  user: [
    "projects:read",
    "projects:write",
    "tasks:read",
    "tasks:write",
    "tasks:assign",
    "comments:read",
    "comments:write",
    "comments:delete",
    "activities:read",
    "profile:read",
    "profile:write",
  ],
};

// Permission hook
export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user?.role) return false;

      const userPermissions = ROLE_PERMISSIONS[user.role] || [];
      return userPermissions.includes(permission);
    },
    [user?.role]
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission]
  );

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every((permission) => hasPermission(permission));
    },
    [hasPermission]
  );

  // Check if user can access admin features
  const canAccessAdmin = useCallback((): boolean => {
    return hasPermission("users:read");
  }, [hasPermission]);

  // Check if user can manage users
  const canManageUsers = useCallback((): boolean => {
    return hasPermission("users:write");
  }, [hasPermission]);

  // Check if user can delete users
  const canDeleteUsers = useCallback((): boolean => {
    return hasPermission("users:delete");
  }, [hasPermission]);

  // Check if user can manage projects
  const canManageProjects = useCallback((): boolean => {
    return hasPermission("projects:write");
  }, [hasPermission]);

  // Check if user can delete projects
  const canDeleteProjects = useCallback((): boolean => {
    return hasPermission("projects:delete");
  }, [hasPermission]);

  // Check if user can manage project members
  const canManageProjectMembers = useCallback((): boolean => {
    return hasPermission("projects:manage_members");
  }, [hasPermission]);

  // Check if user can manage tasks
  const canManageTasks = useCallback((): boolean => {
    return hasPermission("tasks:write");
  }, [hasPermission]);

  // Check if user can delete tasks
  const canDeleteTasks = useCallback((): boolean => {
    return hasPermission("tasks:delete");
  }, [hasPermission]);

  // Check if user can assign tasks
  const canAssignTasks = useCallback((): boolean => {
    return hasPermission("tasks:assign");
  }, [hasPermission]);

  // Check if user can manage comments
  const canManageComments = useCallback((): boolean => {
    return hasPermission("comments:write");
  }, [hasPermission]);

  // Check if user can delete comments
  const canDeleteComments = useCallback((): boolean => {
    return hasPermission("comments:delete");
  }, [hasPermission]);

  // Check if user can view activities
  const canViewActivities = useCallback((): boolean => {
    return hasPermission("activities:read");
  }, [hasPermission]);

  // Check if user can manage their own profile
  const canManageProfile = useCallback((): boolean => {
    return hasPermission("profile:write");
  }, [hasPermission]);

  // Get user's role
  const getUserRole = useCallback((): string | null => {
    return user?.role || null;
  }, [user?.role]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return user?.role === "admin";
  }, [user?.role]);

  // Check if user is regular user
  const isUser = useCallback((): boolean => {
    return user?.role === "user";
  }, [user?.role]);

  // Get all user permissions
  const getUserPermissions = useCallback((): Permission[] => {
    if (!user?.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  return {
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Specific permission checks
    canAccessAdmin,
    canManageUsers,
    canDeleteUsers,
    canManageProjects,
    canDeleteProjects,
    canManageProjectMembers,
    canManageTasks,
    canDeleteTasks,
    canAssignTasks,
    canManageComments,
    canDeleteComments,
    canViewActivities,
    canManageProfile,

    // Role checks
    getUserRole,
    isAdmin,
    isUser,
    getUserPermissions,
  };
};
