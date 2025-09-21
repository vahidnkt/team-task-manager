import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
} from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "./common.dto";

// Create Comment DTO
export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: "Comment text is required" })
  @MaxLength(1000, {
    message: "Comment text must be less than 1000 characters",
  })
  @Transform(({ value }) => value?.trim())
  text: string;
}

// Update Comment DTO
export class UpdateCommentDto {
  @IsString()
  @MinLength(1, { message: "Comment text is required" })
  @MaxLength(1000, {
    message: "Comment text must be less than 1000 characters",
  })
  @Transform(({ value }) => value?.trim())
  text: string;
}

// Get All Comments Query DTO
export class GetAllCommentsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsIn(["created_at", "updated_at"], {
    message: "Sort by must be one of: created_at, updated_at",
  })
  sortBy?: "created_at" | "updated_at" = "created_at";
}

// Get My Comments Query DTO
export class GetMyCommentsQueryDto extends GetAllCommentsQueryDto {}

// Get Task Comments Query DTO
export class GetTaskCommentsQueryDto extends GetAllCommentsQueryDto {}
