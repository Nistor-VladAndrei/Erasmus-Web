import { Article } from '../../articles/entities/article.entity';
export declare class User {
    id: string;
    username: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    isValidated: boolean;
    articles: Article[];
}
