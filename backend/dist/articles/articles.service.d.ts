import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesService {
    private articlesRepository;
    constructor(articlesRepository: Repository<Article>);
    private createSlug;
    private sanitizeContent;
    findAll(page?: number, limit?: number): Promise<{
        data: Article[];
        total: number;
    }>;
    findAllForAdmin(): Promise<Article[]>;
    findAllForUser(userId: string): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    findBySlug(slug: string): Promise<Article>;
    create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<void>;
}
