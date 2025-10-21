import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useAnimation } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Header from '../components/Header.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { articlesAPI } from '../services/api.ts';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getOne(id!),
    enabled: !!id,
  });
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen">

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/news"
            className="inline-flex items-center space-x-2 text-white hover:text-eu-yellow transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to News</span>
          </Link>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          )}

          {error && (
            <GlassCard className="p-12 text-center">
              <p className="text-red-300 text-lg">
                Failed to load article. Please try again later.
              </p>
            </GlassCard>
          )}

          {article && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="overflow-hidden">
                {article.coverImageUrl && (
                  <div className="h-96 overflow-hidden">
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8 md:p-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span>{article.author.email.split('@')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <button
                      onClick={handleShare}
                      className="ml-auto flex items-center space-x-2 hover:text-white transition-colors"
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>

                  <div
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
