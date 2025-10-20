import { Article } from '../../articles/entities/article.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    articles: Article[];
}
