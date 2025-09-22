# Task Management System Frontend Documentation

## Tech Stack

- **Frontend Framework**: React 18+ (Latest Stable) with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: JWT with Redux Persist
- **UI Components**: Headless UI (for modals, dropdowns)
- **Icons**: Heroicons or Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **HTTP Client**: RTK Query (built-in fetch)
- **Type Safety**: TypeScript with strict mode

## Project Structure with File Explanations

```
src/
├── types/                    # TypeScript type definitions
│   ├── auth.types.ts        # Authentication related types (User, LoginRequest, etc.)
│   ├── project.types.ts     # Project entity types (Project, CreateProjectRequest, etc.)
│   ├── task.types.ts        # Task entity types (Task, TaskStatus, Priority, etc.)
│   ├── comment.types.ts     # Comment entity types
│   ├── api.types.ts         # API response types (ApiResponse, PaginatedResponse, etc.)
│   └── index.ts             # Export all types from single entry point
├── components/               # Reusable UI components
│   ├── common/              # Generic, reusable components across the app
│   │   ├── Button.tsx       # Customizable button with variants, sizes, loading states
│   │   ├── Input.tsx        # Form input with validation styling and error display
│   │   ├── Modal.tsx        # Modal wrapper with backdrop, close handlers
│   │   ├── Loading.tsx      # Loading spinners and skeleton components
│   │   ├── ErrorBoundary.tsx # React error boundary for graceful error handling
│   │   ├── ConfirmDialog.tsx # Confirmation modal for destructive actions
│   │   ├── Toast.tsx        # Notification toast component
│   │   └── Tooltip.tsx      # Hover tooltip component
│   ├── layout/              # Application layout components
│   │   ├── Header.tsx       # Top navigation bar with user menu, notifications
│   │   ├── Sidebar.tsx      # Side navigation menu with role-based items
│   │   ├── Layout.tsx       # Main layout wrapper combining header + sidebar + content
│   │   ├── ProtectedRoute.tsx # Route wrapper for authentication and role checking
│   │   └── AdminRoute.tsx   # Specific wrapper for admin-only routes
│   └── ui/                  # Domain-specific UI components
│       ├── TaskCard.tsx     # Individual task display card for kanban board
│       ├── ProjectCard.tsx  # Project preview card for dashboard
│       ├── UserAvatar.tsx   # User profile picture with fallback initials
│       ├── StatusBadge.tsx  # Status indicator (todo, in-progress, done)
│       ├── PriorityBadge.tsx # Priority indicator (low, medium, high)
│       ├── CommentItem.tsx  # Individual comment display with author and timestamp
│       ├── ActivityItem.tsx # Activity history item display
│       └── SearchInput.tsx  # Search input with debouncing and clear functionality
├── pages/                   # Page-level components (route components)
│   ├── auth/               # Authentication related pages
│   │   ├── Login.tsx       # Login form with validation and error handling
│   │   ├── Register.tsx    # User registration form
│   │   └── ForgotPassword.tsx # Password reset request form
│   ├── dashboard/          # Dashboard pages for different roles
│   │   ├── Dashboard.tsx   # Main dashboard showing user's projects and tasks
│   │   └── AdminDashboard.tsx # Admin overview with statistics and management
│   ├── projects/           # Project management pages
│   │   ├── ProjectsList.tsx # List all projects with search and filters
│   │   ├── ProjectDetail.tsx # Single project view with tasks overview
│   │   ├── CreateProject.tsx # Form to create new project
│   │   └── EditProject.tsx # Form to edit existing project
│   ├── tasks/              # Task management pages
│   │   ├── TaskBoard.tsx   # Kanban board view with drag-and-drop
│   │   ├── TaskDetail.tsx  # Detailed task view with comments and activity
│   │   ├── CreateTask.tsx  # Form to create new task
│   │   ├── EditTask.tsx    # Form to edit existing task
│   │   └── TaskComments.tsx # Comments section component
│   ├── users/              # User management pages (admin only)
│   │   ├── UsersList.tsx   # List all users with roles and status
│   │   └── UserDetail.tsx  # Individual user profile and activity
│   ├── profile/            # User profile management
│   │   ├── Profile.tsx     # User's own profile view and edit
│   │   └── ChangePassword.tsx # Password change form
│   └── NotFound.tsx        # 404 error page
├── store/                  # Redux store configuration and slices
│   ├── index.ts            # Store configuration with middleware and persistence
│   ├── rootReducer.ts      # Combine all reducers
│   ├── authSlice.ts        # Authentication state (user, token, isAuthenticated)
│   ├── uiSlice.ts          # UI state (modals, toasts, loading states)
│   └── api/                # RTK Query API slices
│       ├── baseApi.ts      # Base API configuration with common settings
│       ├── authApi.ts      # Authentication endpoints (login, register, refresh)
│       ├── projectsApi.ts  # Project CRUD operations
│       ├── tasksApi.ts     # Task CRUD operations and status updates
│       ├── commentsApi.ts  # Comment operations for tasks
│       ├── usersApi.ts     # User management operations (admin)
│       └── activityApi.ts  # Activity/history tracking endpoints
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication state and methods
│   ├── usePermissions.ts   # Role-based permission checking
│   ├── useLocalStorage.ts  # Local storage management with TypeScript
│   ├── useDebounce.ts      # Debouncing hook for search inputs
│   ├── useToast.ts         # Toast notification management
│   └── useModal.ts         # Modal state management
├── utils/                  # Utility functions and helpers
│   ├── constants.ts        # App-wide constants (API URLs, roles, statuses)
│   ├── helpers.ts          # General utility functions
│   ├── dateUtils.ts        # Date formatting and manipulation
│   ├── validationSchemas.ts # Zod validation schemas for forms
│   ├── permissions.ts      # Role-based access control logic
│   ├── storage.ts          # Local/session storage utilities
│   └── apiUtils.ts         # API-related helper functions
├── styles/                 # Global styles and CSS
│   ├── globals.css         # Global CSS reset, Tailwind imports, custom styles
│   ├── components.css      # Component-specific CSS overrides
│   └── variables.css       # CSS custom properties for theming
├── assets/                 # Static assets
│   ├── images/             # Images, logos, illustrations
│   │   ├── logo.svg
│   │   └── default-avatar.png
│   └── icons/              # Custom SVG icons if not using icon library
├── config/                 # Configuration files
│   ├── env.ts              # Environment variables with TypeScript
│   └── api.ts              # API configuration and base URLs
├── App.tsx                 # Main application component with routing
├── main.tsx                # Application entry point with providers
├── router.tsx              # Route configuration with lazy loading
└── vite-env.d.ts           # Vite TypeScript declarations
```

## Step-by-Step Development Plan (Day-wise Tasks)

### Day 1: Project Setup and Configuration

**Morning (2-3 hours)**

1. **Initialize Vite React TypeScript project**

   ```bash
   npm create vite@latest task-manager-frontend -- --template react-ts
   cd task-manager-frontend
   npm install
   ```

2. **Install core dependencies**

   ```bash
   npm install @reduxjs/toolkit react-redux redux-persist
   npm install react-router-dom @types/react-router-dom
   npm install react-hook-form zod @hookform/resolvers
   npm install tailwindcss postcss autoprefixer
   npm install @headlessui/react @heroicons/react
   npm install date-fns clsx
   ```

3. **Install dev dependencies**
   ```bash
   npm install -D @types/node
   npm install -D @tailwindcss/forms @tailwindcss/typography
   ```

**Afternoon (2-3 hours)** 4. **Setup Tailwind CSS configuration**

- Initialize Tailwind: `npx tailwindcss init -p`
- Configure `tailwind.config.js` with custom theme
- Setup `styles/globals.css` with Tailwind imports and CSS variables

5. **Create basic folder structure**

   - Create all folders from the structure above
   - Add `index.ts` files for clean imports
   - Setup `tsconfig.json` with path aliases

6. **Configure TypeScript**
   - Update `tsconfig.json` with strict mode
   - Add path aliases for clean imports
   - Setup `vite.config.ts` with aliases

**Evening (1-2 hours)** 7. **Setup environment configuration**

- Create `.env.example` and `.env.local`
- Create `config/env.ts` for typed environment variables
- Setup `config/api.ts` with base API configuration

### Day 2: Type Definitions and Store Setup

**Morning (3-4 hours)**

1. **Create TypeScript type definitions**

   - `types/auth.types.ts`: User, LoginRequest, RegisterRequest, AuthState
   - `types/project.types.ts`: Project, CreateProjectRequest, UpdateProjectRequest
   - `types/task.types.ts`: Task, TaskStatus, Priority, CreateTaskRequest
   - `types/comment.types.ts`: Comment, CreateCommentRequest
   - `types/api.types.ts`: ApiResponse, PaginatedResponse, ErrorResponse

2. **Setup Redux store configuration**
   - `store/index.ts`: Configure store with RTK Query and Redux Persist
   - `store/rootReducer.ts`: Combine all reducers
   - `store/authSlice.ts`: Authentication state management
   - `store/uiSlice.ts`: UI state (modals, toasts, loading)

**Afternoon (3-4 hours)** 3. **Create RTK Query API slices**

- `store/api/baseApi.ts`: Base API configuration with authentication
- `store/api/authApi.ts`: Login, register, logout, refresh token endpoints
- `store/api/projectsApi.ts`: Project CRUD operations
- `store/api/tasksApi.ts`: Task operations with role-based filtering
- `store/api/usersApi.ts`: User management for admin

4. **Setup custom hooks**
   - `hooks/useAuth.ts`: Authentication state and methods
   - `hooks/usePermissions.ts`: Role-based access control
   - `hooks/useToast.ts`: Toast notifications
   - `hooks/useDebounce.ts`: Search input debouncing

### Day 3: Common Components and Layout

**Morning (4-5 hours)**

1. **Create common UI components**

   - `components/common/Button.tsx`: Reusable button with variants
   - `components/common/Input.tsx`: Form input with validation display
   - `components/common/Modal.tsx`: Modal wrapper with backdrop
   - `components/common/Loading.tsx`: Loading states and skeletons
   - `components/common/Toast.tsx`: Notification system

2. **Create layout components**
   - `components/layout/Header.tsx`: Navigation bar with user menu
   - `components/layout/Sidebar.tsx`: Side navigation with role-based menu
   - `components/layout/Layout.tsx`: Main layout wrapper
   - `components/layout/ProtectedRoute.tsx`: Authentication guard

**Afternoon (3-4 hours)** 3. **Create domain-specific UI components**

- `components/ui/UserAvatar.tsx`: User profile picture component
- `components/ui/StatusBadge.tsx`: Task status indicator
- `components/ui/PriorityBadge.tsx`: Task priority indicator
- `components/ui/SearchInput.tsx`: Debounced search input

4. **Setup routing**
   - `router.tsx`: Route configuration with lazy loading
   - Setup protected routes for authenticated users
   - Setup admin routes with role checking

### Day 4: Authentication Pages

**Morning (3-4 hours)**

1. **Create authentication pages**

   - `pages/auth/Login.tsx`: Login form with validation
   - `pages/auth/Register.tsx`: Registration form
   - Implement form validation with Zod schemas
   - Add error handling and loading states

2. **Setup authentication flow**
   - Connect login/register forms to Redux store
   - Implement JWT token storage and persistence
   - Add automatic token refresh logic

**Afternoon (3-4 hours)** 3. **Create validation schemas**

- `utils/validationSchemas.ts`: Zod schemas for all forms
- Setup form error handling and display
- Add client-side validation rules

4. **Test authentication flow**
   - Test login/logout functionality
   - Test token persistence across browser refresh
   - Test role-based redirects

### Day 5: Dashboard and Project Management

**Morning (4-5 hours)**

1. **Create dashboard pages**

   - `pages/dashboard/Dashboard.tsx`: User dashboard with assigned tasks
   - `pages/dashboard/AdminDashboard.tsx`: Admin overview with statistics
   - Add role-based data filtering

2. **Create project management pages**
   - `pages/projects/ProjectsList.tsx`: List projects with search/filter
   - `pages/projects/CreateProject.tsx`: Project creation form
   - `components/ui/ProjectCard.tsx`: Project preview card

**Afternoon (3-4 hours)** 3. **Implement project CRUD operations**

- Connect forms to Redux API slices
- Add loading states and error handling
- Implement optimistic updates

4. **Add project detail view**
   - `pages/projects/ProjectDetail.tsx`: Single project overview
   - Show project tasks summary
   - Add team member management

### Day 6: Task Management and Kanban Board

**Full Day (8-10 hours)**

1. **Create task management components**

   - `components/ui/TaskCard.tsx`: Individual task display
   - `pages/tasks/CreateTask.tsx`: Task creation form
   - `pages/tasks/EditTask.tsx`: Task editing form
   - `pages/tasks/TaskDetail.tsx`: Detailed task view

2. **Implement Kanban board**

   - `pages/tasks/TaskBoard.tsx`: Drag-and-drop Kanban board
   - Add task status columns (To Do, In Progress, Done)
   - Implement drag-and-drop functionality (if time permits, otherwise visual columns)
   - Add task filtering and search

3. **Add comments system**

   - `pages/tasks/TaskComments.tsx`: Comments display and form
   - `components/ui/CommentItem.tsx`: Individual comment component
   - Connect to comments API

4. **Implement activity tracking**
   - `components/ui/ActivityItem.tsx`: Activity history display
   - Show task creation, status changes, assignments
   - Add real-time activity updates

### Day 7: User Management and Polish

**Morning (3-4 hours)**

1. **Create user management (Admin only)**

   - `pages/users/UsersList.tsx`: All users list with roles
   - `pages/users/UserDetail.tsx`: Individual user profile
   - Add user role management

2. **Create profile management**
   - `pages/profile/Profile.tsx`: User profile view and edit
   - `pages/profile/ChangePassword.tsx`: Password change form

**Afternoon (4-5 hours)** 3. **Add advanced features**

- Implement search and filtering across all lists
- Add sorting options for tasks and projects
- Implement pagination for large datasets
- Add bulk operations where applicable

4. **Polish and testing**
   - Add loading skeletons for better UX
   - Implement comprehensive error handling
   - Add form validation feedback
   - Test all user flows and edge cases
   - Add responsive design improvements

**Evening (2-3 hours)** 5. **Final touches**

- Add 404 error page
- Implement proper error boundaries
- Add accessibility improvements
- Test cross-browser compatibility
- Final code review and cleanup

## Utility Files Explanation

### `utils/constants.ts`

```typescript
// API endpoints, user roles, task statuses, priorities
// Application-wide configuration values
// Error messages and success messages
```

### `utils/helpers.ts`

```typescript
// General utility functions like string manipulation
// Array operations, object transformations
// Common business logic functions
```

### `utils/permissions.ts`

```typescript
// Role-based access control logic
// Permission checking functions
// Route access validation
```

### `utils/validationSchemas.ts`

```typescript
// Zod schemas for all forms
// Validation rules and error messages
// Custom validation functions
```

### `config/env.ts`

```typescript
// Type-safe environment variable access
// Default values and validation
// Environment-specific configurations
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

## Environment Variables (.env)

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Task Manager
VITE_ENABLE_DEVTOOLS=true
VITE_JWT_SECRET_KEY=your-secret-key
VITE_REFRESH_TOKEN_KEY=refresh_token
```


**\*\*\*\***importent**\*\*\*\***\*\***\*\*\*\***pls keep this thing also (
1 =  Performance & Optimization
Lazy-load pages/components (you already plan lazy routes 👍).
Use React.Suspense for data fetching when RTK Query supports streaming.
Consider React Query if you ever need more fine-grained caching controls (RTK Query is still great for CRUD-heavy apps).

2 =Theming & Accessibility
Dark/light mode toggle via Tailwind config.
Ensure Headless UI components are properly labeled (aria tags).)

3 = Error Logging
Integrate Sentry (or similar) for error monitoring in production.
