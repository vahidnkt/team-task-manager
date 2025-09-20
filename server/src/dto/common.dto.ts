import { IsUUID, IsOptional, IsInt, Min, Max, IsIn } from "class-validator";
import { Transform, Type } from "class-transformer";

// Common Parameter DTOs
export class IdParamDto {
  @IsUUID(4, { message: "ID must be a valid UUID" })
  id: string;
}

export class ProjectIdParamDto {
  @IsUUID(4, { message: "Project ID must be a valid UUID" })
  projectId: string;
}

export class TaskIdParamDto {
  @IsUUID(4, { message: "Task ID must be a valid UUID" })
  taskId: string;
}

// Common Query DTOs
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(100, { message: "Limit must be at most 100" })
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Offset must be an integer" })
  @Min(0, { message: "Offset must be non-negative" })
  offset?: number = 0;
}

export class SortQueryDto {
  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}

// Base Query DTO with pagination and sorting
export class BaseQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}
