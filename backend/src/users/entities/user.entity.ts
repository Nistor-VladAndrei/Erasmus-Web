import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'admin' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];
}