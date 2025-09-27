import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Layout, ProtectedRoute } from "./components/layout";
import { PageLoading } from "./components/common/Loading";
import { ErrorBoundary } from "./components/common";

// Lazy load all page components for better performance
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));

const ProjectsList = React.lazy(() => import("./pages/projects/ProjectsList"));
const ProjectDetail = React.lazy(
  () => import("./pages/projects/ProjectDetail")
);
const CreateProject = React.lazy(
  () => import("./pages/projects/CreateProject")
);
const EditProject = React.lazy(() => import("./pages/projects/EditProject"));

const TaskBoard = React.lazy(() => import("./pages/tasks/TaskBoard"));
const TaskDetail = React.lazy(() => import("./pages/tasks/TaskDetail"));
const CreateTask = React.lazy(() => import("./pages/tasks/CreateTask"));
const EditTask = React.lazy(() => import("./pages/tasks/EditTask"));
const TaskComments = React.lazy(() => import("./pages/tasks/TaskComments"));

const UsersList = React.lazy(() => import("./pages/users/UsersList"));
const UserDetail = React.lazy(() => import("./pages/users/UserDetail"));

const Activities = React.lazy(() => import("./pages/activities/Activities"));

const Profile = React.lazy(() => import("./pages/profile/Profile"));

const NotFound = React.lazy(() => import("./pages/NotFound"));

// Loading wrapper component
const LazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoading message="Loading page..." />}>
    {children}
  </Suspense>
);

// Router configuration
export const router = createBrowserRouter([
  // Auth routes (no authentication required)
  {
    path: "/auth/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LazyWrapper>
          <Login />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LazyWrapper>
          <Register />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/auth/forgot-password",
  //   element: (
  //     <ProtectedRoute requireAuth={false}>
  //       <LazyWrapper>
  //         <ForgotPassword />
  //       </LazyWrapper>
  //     </ProtectedRoute>
  //   ),
  // },

  // Redirect root to login page
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },

  // Redirect /login to /auth/login for consistency
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },

  // Protected routes (authentication required)
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      // Dashboard routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <Dashboard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },

      // Project routes
      {
        path: "projects",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <ProjectsList />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/new",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <CreateProject />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:id",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <ProjectDetail />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:id/edit",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <EditProject />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:projectId/tasks/new",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <CreateTask />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:projectId/tasks",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <TaskBoard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },

      // Task routes
      {
        path: "tasks",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <TaskBoard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/my",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <TaskBoard showMyTasks={true} />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/board",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <TaskBoard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/new",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <CreateTask />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/:id",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <TaskDetail />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/:id/edit",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <EditTask />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/:id/comments",
        element: (
          <ProtectedRoute requireAuth>
            <ErrorBoundary>
              <LazyWrapper>
                <TaskComments />
              </LazyWrapper>
            </ErrorBoundary>
          </ProtectedRoute>
        ),
      },

      // User management routes (admin only)
      {
        path: "users",
        element: (
          <ProtectedRoute requireAuth requireAdmin>
            <LazyWrapper>
              <UsersList />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute requireAuth requireAdmin>
            <LazyWrapper>
              <UserDetail />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },

      // Activities routes
      {
        path: "activities",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <Activities />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },

      // Profile routes
      {
        path: "profile",
        element: (
          <ProtectedRoute requireAuth>
            <LazyWrapper>
              <Profile />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "profile/change-password",
      //   element: (
      //     <ProtectedRoute requireAuth>
      //       <LazyWrapper>
      //         <ChangePassword />
      //       </LazyWrapper>
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },

  // 404 page
  {
    path: "*",
    element: (
      <LazyWrapper>
        <NotFound />
      </LazyWrapper>
    ),
  },
]);

// Route constants for easy navigation
export const ROUTES = {
  // Auth routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin",

  // Project routes
  PROJECTS: "/projects",
  CREATE_PROJECT: "/projects/new",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  EDIT_PROJECT: (id: string) => `/projects/${id}/edit`,
  CREATE_TASK_FOR_PROJECT: (projectId: string) =>
    `/projects/${projectId}/tasks/new`,
  PROJECT_TASKS: (projectId: string) => `/projects/${projectId}/tasks`,

  // Task routes
  TASKS: "/tasks",
  MY_TASKS: "/tasks/my",
  TASK_BOARD: "/tasks/board",
  CREATE_TASK: "/tasks/new",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  EDIT_TASK: (id: string) => `/tasks/${id}/edit`,
  TASK_COMMENTS: (id: string) => `/tasks/${id}/comments`,

  // User routes
  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,

  // Profile routes
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",

  // Other routes
  NOT_FOUND: "*",
} as const;

// Navigation helper functions
export const navigation = {
  // Auth navigation
  goToLogin: () => ROUTES.LOGIN,
  goToRegister: () => ROUTES.REGISTER,
  goToForgotPassword: () => ROUTES.FORGOT_PASSWORD,

  // Dashboard navigation
  goToDashboard: () => ROUTES.DASHBOARD,
  goToAdminDashboard: () => ROUTES.ADMIN_DASHBOARD,

  // Project navigation
  goToProjects: () => ROUTES.PROJECTS,
  goToCreateProject: () => ROUTES.CREATE_PROJECT,
  goToProjectDetail: (id: string) => ROUTES.PROJECT_DETAIL(id),
  goToEditProject: (id: string) => ROUTES.EDIT_PROJECT(id),
  goToCreateTaskForProject: (projectId: string) =>
    ROUTES.CREATE_TASK_FOR_PROJECT(projectId),
  goToProjectTasks: (projectId: string) => ROUTES.PROJECT_TASKS(projectId),

  // Task navigation
  goToTasks: () => ROUTES.TASKS,
  goToCreateTask: () => ROUTES.CREATE_TASK,
  goToTaskDetail: (id: string) => ROUTES.TASK_DETAIL(id),
  goToEditTask: (id: string) => ROUTES.EDIT_TASK(id),
  goToTaskComments: (id: string) => ROUTES.TASK_COMMENTS(id),

  // User navigation
  goToUsers: () => ROUTES.USERS,
  goToUserDetail: (id: string) => ROUTES.USER_DETAIL(id),

  // Profile navigation
  goToProfile: () => ROUTES.PROFILE,
  goToChangePassword: () => ROUTES.CHANGE_PASSWORD,
} as const;
