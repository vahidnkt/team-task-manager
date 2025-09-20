import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

// Create Comment DTO
export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Comment text is required' })
  @MaxLength(1000, { message: 'Comment text must be less than 1000 characters' })
  @Transform(({ value }) => value?.trim())
  text: string;
}

// Update Comment DTO
export class UpdateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Comment text is required' })
  @MaxLength(1000, { message: 'Comment text must be less than 1000 characters' })
  @Transform(({ value }) => value?.trim())
  text: string;
}
