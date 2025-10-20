import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(page?: number, limit?: number): Promise<{
        data: import("./entities/article.entity").Article[];
        total: number;
    }>;
    findAllForAdmin(): Promise<import("./entities/article.entity").Article[]>;
    findOne(id: string): Promise<import("./entities/article.entity").Article>;
    create(createArticleDto: CreateArticleDto, req: any): Promise<import("./entities/article.entity").Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<import("./entities/article.entity").Article>;
    remove(id: string): Promise<void>;
}
