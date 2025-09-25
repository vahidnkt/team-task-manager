import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";

// Single Dashboard Query DTO - supports all dashboard data
export class DashboardQueryDto {
  // Stats configuration
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(365)
  statsDays?: number = 30;

  // Recent tasks configuration
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  recentTasksLimit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  recentTasksOffset?: number = 0;

  // Recent activities configuration
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  recentActivitiesLimit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  recentActivitiesOffset?: number = 0;

  // Projects configuration
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  projectsLimit?: number = 20;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  projectsOffset?: number = 0;

  @IsOptional()
  @IsString()
  @IsEnum(["active", "completed", "all"])
  projectsStatus?: string = "all";

  // Data inclusion flags (optional - for future flexibility)
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  includeStats?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  includeRecentTasks?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  includeRecentActivities?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  includeProjects?: boolean = true;
}

// Dashboard Response DTOs
export class DashboardStatsResponseDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUsers?: number; // Admin only
  activeUsers?: number; // Admin only
}

export class DashboardRecentTaskDto {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: string;
  projectName: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
}

export class DashboardRecentActivityDto {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  createdAt: string;
}

export class DashboardProjectDto {
  id: string;
  name: string;
  description?: string;
  taskCount: number;
  completedTaskCount: number;
  progressPercentage: number;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

// Complete Dashboard Response DTO
export class DashboardResponseDto {
  stats: DashboardStatsResponseDto;
  recentTasks: DashboardRecentTaskDto[];
  recentActivities: DashboardRecentActivityDto[];
  projects: DashboardProjectDto[];
  // Additional metadata
  metadata: {
    generatedAt: string;
    userRole: string;
    dataRange: {
      statsDays: number;
      recentTasksCount: number;
      recentActivitiesCount: number;
      projectsCount: number;
    };
  };
}

// Legacy DTOs for backward compatibility (can be removed later)
export class DashboardStatsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number = 30;
}

export class DashboardRecentQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

export class DashboardProjectsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  status?: string;
}

export class DashboardDataQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(365)
  statsDays?: number = 30;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  recentLimit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  recentOffset?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  projectsLimit?: number = 20;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  projectsOffset?: number = 0;
}
