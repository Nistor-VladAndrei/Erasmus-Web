import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    getMyArticles(req: any, page: number, limit: number): Promise<Article[]>;
    findAll(page?: number, limit?: number): Promise<{
        data: Article[];
        total: number;
    }>;
    findAllForAdmin(): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    create(createArticleDto: CreateArticleDto, req: any): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<void>;
}
