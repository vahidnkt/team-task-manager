import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

// User Registration DTO
export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  @Transform(({ value }) => value?.trim())
  username: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;

  @IsOptional()
  @IsIn(["user", "admin"], { message: 'Role must be either "user" or "admin"' })
  role?: "user" | "admin";
}

// User Login DTO
export class LoginDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  password: string;
}

// Update Profile DTO
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  @Transform(({ value }) => value?.trim())
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: "Current password must be at least 6 characters long",
  })
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "New password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  newPassword?: string;
}

// Get All Users Query DTO
export class GetAllUsersQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsIn(["user", "admin"], { message: 'Role must be either "user" or "admin"' })
  role?: "user" | "admin";

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;

  @IsOptional()
  @IsIn(
    ["username", "email", "created_at", "updated_at", "createdAt", "updatedAt"],
    {
      message:
        "Sort by must be one of: username, email, created_at, updated_at, createdAt, updatedAt",
    }
  )
  sortBy?:
    | "username"
    | "email"
    | "created_at"
    | "updated_at"
    | "createdAt"
    | "updatedAt" = "created_at";

  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: 'Sort order must be either "ASC" or "DESC"',
  })
  sortOrder?: "ASC" | "DESC" = "DESC";
}
