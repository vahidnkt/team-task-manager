import {
  IsString,
  IsOptional,
  IsUUID,
  IsIn,
  IsDateString,
  MinLength,
  MaxLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";

// Create Task DTO
export class CreateTaskDto {
  @IsString()
  @MinLength(1, { message: "Task title is required" })
  @MaxLength(255, { message: "Task title must be less than 255 characters" })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "Description must be less than 1000 characters" })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: "Assignee ID must be a valid UUID" })
  assignee_id?: string | null;

  @IsOptional()
  @IsIn(["todo", "in-progress", "done"], {
    message: 'Status must be "todo", "in-progress", or "done"',
  })
  status?: "todo" | "in-progress" | "done";

  @IsOptional()
  @IsIn(["low", "medium", "high"], {
    message: 'Priority must be "low", "medium", or "high"',
  })
  priority?: "low" | "medium" | "high";

  @IsOptional()
  @IsDateString(
    {},
    { message: "Due date must be a valid ISO 8601 date string" }
  )
  due_date?: string;
}

// Update Task DTO
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Task title cannot be empty" })
  @MaxLength(255, { message: "Task title must be less than 255 characters" })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "Description must be less than 1000 characters" })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: "Assignee ID must be a valid UUID" })
  assignee_id?: string | null;

  @IsOptional()
  @IsIn(["todo", "in-progress", "done"], {
    message: 'Status must be "todo", "in-progress", or "done"',
  })
  status?: "todo" | "in-progress" | "done";

  @IsOptional()
  @IsIn(["low", "medium", "high"], {
    message: 'Priority must be "low", "medium", or "high"',
  })
  priority?: "low" | "medium" | "high";

  @IsOptional()
  @IsDateString(
    {},
    { message: "Due date must be a valid ISO 8601 date string" }
  )
  due_date?: string;
}

// Update Task Status DTO
export class UpdateTaskStatusDto {
  @IsIn(["todo", "in-progress", "done"], {
    message: 'Status must be "todo", "in-progress", or "done"',
  })
  status: "todo" | "in-progress" | "done";
}

// Assign Task DTO
export class AssignTaskDto {
  @IsOptional()
  @IsUUID(4, { message: "Assignee ID must be a valid UUID or null" })
  assignee_id?: string | null;
}

// Get All Tasks Query DTO
export class GetAllTasksQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  status?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  priority?: string;

  @IsOptional()
  @IsUUID(4, { message: "Assignee ID must be a valid UUID" })
  assignee_id?: string;

  @IsOptional()
  @IsUUID(4, { message: "Project ID must be a valid UUID" })
  project_id?: string;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsIn(
    ["title", "status", "priority", "created_at", "updated_at", "due_date"],
    {
      message:
        "Sort by must be one of: title, status, priority, created_at, updated_at, due_date",
    }
  )
  sortBy?:
    | "title"
    | "status"
    | "priority"
    | "created_at"
    | "updated_at"
    | "due_date" = "created_at";

  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}

// Get My Tasks Query DTO
export class GetMyTasksQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  status?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  priority?: string;

  @IsOptional()
  @IsUUID(4, { message: "Project ID must be a valid UUID" })
  project_id?: string;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsIn(
    ["title", "status", "priority", "created_at", "updated_at", "due_date"],
    {
      message:
        "Sort by must be one of: title, status, priority, created_at, updated_at, due_date",
    }
  )
  sortBy?:
    | "title"
    | "status"
    | "priority"
    | "created_at"
    | "updated_at"
    | "due_date" = "created_at";

  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}
