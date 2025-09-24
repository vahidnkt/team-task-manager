import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { Transform } from "class-transformer";

// Dashboard Stats Query DTO
export class DashboardStatsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number = 30;
}

// Dashboard Recent Items Query DTO
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

// Dashboard Projects Query DTO
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

// Dashboard Complete Data Query DTO
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

export class DashboardResponseDto {
  stats: DashboardStatsResponseDto;
  recentTasks: DashboardRecentTaskDto[];
  recentActivities: DashboardRecentActivityDto[];
  projects: DashboardProjectDto[];
}
