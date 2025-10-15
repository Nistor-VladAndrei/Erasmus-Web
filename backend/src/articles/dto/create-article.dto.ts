import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

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
}