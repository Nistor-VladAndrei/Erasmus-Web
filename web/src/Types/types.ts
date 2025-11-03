export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  published: boolean;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
export interface SignupResponse {
  access_token: string;
  user: User;
}

export interface ArticlesResponse {
  data: Article[];
  total: number;
}