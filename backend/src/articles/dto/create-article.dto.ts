import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;
}