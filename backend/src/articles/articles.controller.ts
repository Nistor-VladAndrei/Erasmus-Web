import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Public endpoint - Get all published articles with pagination
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.articlesService.findAll(+page, +limit);
  }

  // Admin endpoint - Get all articles including unpublished
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAllForAdmin() {
    return this.articlesService.findAllForAdmin();
  }

  // Public endpoint - Get single article by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  // Protected endpoint - Create new article
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  // Protected endpoint - Update article
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  // Protected endpoint - Delete article
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.articlesService.remove(id);
  }
}