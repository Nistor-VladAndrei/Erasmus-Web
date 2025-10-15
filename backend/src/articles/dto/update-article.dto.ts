import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}