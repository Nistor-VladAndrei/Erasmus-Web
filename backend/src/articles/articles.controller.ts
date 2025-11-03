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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Public endpoint - Get all published articles with pagination
  
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async getMyArticles(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<Article[]> {
    const userId: string = req.user?.sub ?? req.user?.id;

    return this.articlesService.findAllForUser(userId);
  }
  
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.articlesService.findAll(+page, +limit);
  }
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAllForAdmin() {
    console.log('=== ADMIN ENDPOINT HIT ==='); // Debug
    return this.articlesService.findAllForAdmin();
  }

  // Public endpoint - Get single article by ID
  // MUST come AFTER specific routes like 'admin'
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('=== FIND ONE ENDPOINT HIT ===', id); // Debug
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