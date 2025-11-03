import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Article } from '../Types/types';
import GlassCard from './GlassCard.tsx';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/article/${article.id}`}>
        <GlassCard className="overflow-hidden h-full flex flex-col">
          {article.coverImageUrl && (
            <div className="h-48 overflow-hidden">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          )}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-white/70 mb-4 line-clamp-3 flex-1">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{article.author.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}