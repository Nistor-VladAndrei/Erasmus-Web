import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
export declare class Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    imageUrls: string[];
    published: boolean;
    author: User;
    authorId: string;
    project: Project;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}
