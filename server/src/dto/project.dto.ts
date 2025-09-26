import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
} from "class-validator";
import { Transform } from "class-transformer";

// Create Project DTO
export class CreateProjectDto {
  @IsString()
  @MinLength(1, { message: "Project name is required" })
  @MaxLength(255, { message: "Project name must be less than 255 characters" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "Description must be less than 1000 characters" })
  @Transform(({ value }) => value?.trim())
  description?: string;
}

// Update Project DTO
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Project name cannot be empty" })
  @MaxLength(255, { message: "Project name must be less than 255 characters" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "Description must be less than 1000 characters" })
  @Transform(({ value }) => value?.trim())
  description?: string;
}

// Get All Projects Query DTO
export class GetAllProjectsQueryDto {
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
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;

  @IsOptional()
  @IsIn(["name", "status", "priority", "created_at", "updated_at"], {
    message:
      "Sort by must be one of: name, status, priority, created_at, updated_at",
  })
  sortBy?: "name" | "status" | "priority" | "created_at" | "updated_at" =
    "created_at";

  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}

// Complete Project DTO
export class CompleteProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "Completion notes must be less than 500 characters",
  })
  @Transform(({ value }) => value?.trim())
  completionNotes?: string;
}
