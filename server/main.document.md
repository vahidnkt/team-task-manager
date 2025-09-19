# Team Task Manager - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Database Design & Relations](#database-design--relations)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [Environment Setup](#environment-setup)
6. [Development Workflow](#development-workflow)
7. [Architecture Notes](#architecture-notes)

## Project Overview

A comprehensive Team Task Manager application built with Node.js, Express, MySQL, and JWT authentication. The system allows admins to manage projects and tasks while providing role-based access control for users.

### Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Methodology**: Agile Development Approach

### Key Features

- User authentication and role-based authorization
- Project and task management
- Task assignment and status tracking
- Comment system for tasks
- Activity history tracking
- Admin panel for user management

## Database Design & Relations

### 1. Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

**Example Data:**

```
id | username | email | role | created_at
1  | john_doe | john@example.com | admin | 2024-01-15 10:00:00
2  | jane_smith | jane@example.com | user | 2024-01-15 11:00:00
3  | bob_wilson | bob@example.com | user | 2024-01-15 12:00:00
```

### 2. Projects Table

```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Example Data:**

```
id | name | description | created_by | created_at
1  | E-commerce Website | Online shopping platform development | 1 | 2024-01-15 14:00:00
2  | Mobile App | Task management mobile application | 1 | 2024-01-16 09:00:00
3  | API Integration | Third-party service integration | 1 | 2024-01-17 11:00:00
```

### 3. Tasks Table

```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id INT NULL,
    status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);
```

**Example Data:**

```
id | project_id | title | assignee_id | status | priority | due_date
1  | 1 | Design homepage layout | 2 | in-progress | high | 2024-01-20
2  | 1 | Implement user authentication | 3 | todo | medium | 2024-01-25
3  | 2 | Create wireframes | 2 | done | low | 2024-01-18
4  | 1 | Setup payment gateway | NULL | todo | high | 2024-01-30
```

### 4. Comments Table

```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    commenter_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (commenter_id) REFERENCES users(id)
);
```

**Example Data:**

```
id | task_id | commenter_id | text | created_at
1  | 1 | 1 | Please use the brand colors for the design | 2024-01-16 10:30:00
2  | 1 | 2 | I've started working on the responsive layout | 2024-01-16 14:20:00
3  | 3 | 1 | Great work on the wireframes! | 2024-01-18 16:45:00
```

### 5. Activities Table

```sql
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    task_id INT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Example Data:**

```
id | project_id | task_id | user_id | action | description | created_at
1  | 1 | 1 | 1 | task_created | Task 'Design homepage layout' was created | 2024-01-15 15:00:00
2  | 1 | 1 | 1 | task_assigned | Task assigned to Jane Smith | 2024-01-15 15:05:00
3  | 1 | 1 | 2 | status_changed | Task status changed from 'todo' to 'in-progress' | 2024-01-16 09:30:00
```

## Database Relations

### Entity Relationship Diagram (ERD) Description:

**One-to-Many Relations:**

- `users` → `projects` (One user can create many projects)
- `users` → `tasks` (One user can be assigned many tasks)
- `projects` → `tasks` (One project can have many tasks)
- `tasks` → `comments` (One task can have many comments)
- `users` → `comments` (One user can make many comments)
- `projects` → `activities` (One project can have many activities)
- `users` → `activities` (One user can generate many activities)

**Nullable Relations:**

- `tasks.assignee_id` can be NULL (unassigned tasks)
- `activities.task_id` can be NULL (project-level activities)

## Project Structure

```
team-task-manager/
├── src/
│   ├── config/
│   │   ├── database.js           # MySQL connection configuration
│   │   ├── jwt.js               # JWT configuration
│   │   └── environment.js       # Environment variables handler
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── projectController.js # Project CRUD operations
│   │   ├── taskController.js    # Task management
│   │   ├── commentController.js # Comment operations
│   │   └── activityController.js# Activity tracking
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # Role-based access control
│   │   ├── validation.js        # Input validation
│   │   ├── errorHandler.js      # Global error handling
│   │   └── logging.js           # Request logging
│   │
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Project.js           # Project model
│   │   ├── Task.js              # Task model
│   │   ├── Comment.js           # Comment model
│   │   └── Activity.js          # Activity model
│   │
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User routes
│   │   ├── projects.js          # Project routes
│   │   ├── tasks.js             # Task routes
│   │   ├── comments.js          # Comment routes
│   │   └── activities.js        # Activity routes
│   │
│   ├── services/
│   │   ├── authService.js       # Authentication business logic
│   │   ├── userService.js       # User business logic
│   │   ├── projectService.js    # Project business logic
│   │   ├── taskService.js       # Task business logic
│   │   └── activityService.js   # Activity logging service
│   │
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   ├── constants.js         # Application constants
│   │   ├── logger.js            # Logging utility
│   │   └── validators.js        # Custom validators
│   │
│   └── app.js                   # Express app configuration
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_projects_table.sql
│   │   ├── 003_create_tasks_table.sql
│   │   ├── 004_create_comments_table.sql
│   │   └── 005_create_activities_table.sql
│   │
│   └── seeds/
│       ├── users.sql            # Sample user data
│       ├── projects.sql         # Sample project data
│       └── tasks.sql            # Sample task data
│
├── tests/
│   ├── unit/
│   │   ├── controllers/         # Controller unit tests
│   │   ├── services/            # Service unit tests
│   │   └── models/              # Model unit tests
│   │
│   ├── integration/
│   │   ├── auth.test.js         # Authentication integration tests
│   │   ├── projects.test.js     # Project API tests
│   │   └── tasks.test.js        # Task API tests
│   │
│   └── setup.js                 # Test environment setup
│
├── logs/                        # Application logs
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── server.js                    # Application entry point
└── README.md
```

## API Endpoints

### Authentication Routes

```
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout (optional)
GET    /api/auth/profile         # Get current user profile
```

### User Routes

```
GET    /api/users                # Get all users (admin only)
GET    /api/users/:id            # Get specific user
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user (admin only)
```

### Project Routes

```
GET    /api/projects             # Get all projects
POST   /api/projects             # Create new project
GET    /api/projects/:id         # Get specific project
PUT    /api/projects/:id         # Update project
DELETE /api/projects/:id         # Delete project
```

### Task Routes

```
GET    /api/projects/:projectId/tasks     # Get all tasks in project
POST   /api/projects/:projectId/tasks     # Create new task
GET    /api/tasks/:id                     # Get specific task
PUT    /api/tasks/:id                     # Update task
DELETE /api/tasks/:id                     # Delete task
PATCH  /api/tasks/:id/status              # Update task status
PATCH  /api/tasks/:id/assign              # Assign/unassign task
```

### Comment Routes

```
GET    /api/tasks/:taskId/comments        # Get all comments for task
POST   /api/tasks/:taskId/comments        # Add comment to task
PUT    /api/comments/:id                  # Update comment
DELETE /api/comments/:id                  # Delete comment
```

### Activity Routes

```
GET    /api/projects/:projectId/activities # Get project activity history
GET    /api/activities/recent              # Get recent activities (admin)
```

## Environment Setup

### Required Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=team_task_manager
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Security
BCRYPT_SALT_ROUNDS=12

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Development Workflow

### Phase 1: Setup & Foundation (Days 1-2)

1. **Initialize Project**

   - Create project structure
   - Setup package.json with dependencies
   - Configure environment variables
   - Setup Git repository

2. **Database Setup**
   - Create MySQL database
   - Run migration scripts
   - Insert seed data
   - Test database connections

### Phase 2: Core Backend (Days 3-5)

1. **Authentication System**

   - Implement user registration/login
   - Setup JWT middleware
   - Create role-based access control
   - Test authentication flows

2. **User Management**
   - User CRUD operations
   - Profile management
   - Admin user controls

### Phase 3: Core Features (Days 6-10)

1. **Project Management**

   - Project CRUD operations
   - Project listing and filtering
   - Authorization checks

2. **Task Management**
   - Task CRUD within projects
   - Task assignment system
   - Status management
   - Priority handling

### Phase 4: Enhanced Features (Days 11-13)

1. **Comment System**

   - Add comments to tasks
   - Comment management
   - Real-time updates (optional)

2. **Activity Tracking**
   - Log important events
   - Activity history endpoints
   - Activity filtering

### Phase 5: Testing & Documentation (Days 14-15)

1. **Testing**

   - Unit tests for services
   - Integration tests for APIs
   - Error handling tests

2. **Documentation**
   - Complete README
   - API documentation
   - Deployment guide

## Architecture Notes

### Design Patterns

- **MVC Pattern**: Separation of concerns with Controllers, Models, and Views
- **Service Layer**: Business logic separated from controllers
- **Repository Pattern**: Data access abstraction (implemented in models)

### Security Considerations

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Tokens**: Stateless authentication with expiration
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Prepared statements/parameterized queries
- **Role-Based Access**: Admin and user role separation

### Performance Optimizations

- **Database Indexing**: Proper indexes on foreign keys and search fields
- **Query Optimization**: Efficient SQL queries with joins
- **Pagination**: Implement pagination for large datasets
- **Caching Strategy**: Consider Redis for session management (future enhancement)

### Scalability Considerations

- **Modular Architecture**: Easy to extend with new features
- **Microservice Ready**: Components can be extracted into microservices
- **Database Design**: Normalized structure with soft deletes
- **API Versioning**: Structure allows for future API versions

### Trade-offs Made

1. **Stateless JWT vs Sessions**: Chose JWT for scalability but loses server-side control
2. **Soft Delete vs Hard Delete**: Implemented soft deletes for data recovery
3. **Monolithic vs Microservices**: Started monolithic for simplicity
4. **Real-time vs Polling**: Basic implementation without WebSockets (can be added later)

### Future Enhancements

- Real-time notifications with Socket.io
- File attachments for tasks
- Time tracking functionality
- Advanced reporting and analytics
- API rate limiting
- Docker containerization
- CI/CD pipeline setup
