import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  // Helper function to create URL-friendly slugs
  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  // Sanitize HTML content to prevent XSS attacks
  private sanitizeContent(html: string): string {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title', 'width', 'height'],
        a: ['href', 'target', 'rel'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
    });
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Article[]; total: number }> {
    const [data, total] = await this.articlesRepository.findAndCount({
      where: { published: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findAllForAdmin(): Promise<Article[]> {
    return this.articlesRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
  async findAllForUser(userId: string): Promise<Article[]> {
    return this.articlesRepository.find({
      where: { authorId: userId  },   // nested where on relation
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article> {
    const slug = this.createSlug(createArticleDto.title);
    const sanitizedContent = this.sanitizeContent(createArticleDto.content);

    const article = this.articlesRepository.create({
      ...createArticleDto,
      content: sanitizedContent,
      slug,
      authorId,
    });

    return this.articlesRepository.save(article);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);

    if (updateArticleDto.title) {
      article.slug = this.createSlug(updateArticleDto.title);
    }

    if (updateArticleDto.content) {
      updateArticleDto.content = this.sanitizeContent(updateArticleDto.content);
    }

    Object.assign(article, updateArticleDto);

    return this.articlesRepository.save(article);
  }

  async remove(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }
}