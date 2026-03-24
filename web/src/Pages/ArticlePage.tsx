import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Calendar, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard.tsx';
import { ProjectNameBadge } from '../components/ProjectNameBadge.tsx';
import { articlesAPI } from '../services/api.ts';
import type { Article } from '../Types/types';

function ArticleHeader({ article }: { article: Article }) {
  return (
    <div className="mt-12">
      <Link
        to="/news"
        className="inline-flex items-center space-x-2 text-white hover:text-eu-yellow transition-colors mb-0"
        aria-label="Back to news"
      >
        <ArrowLeft size={20} />
        <span>Back to News</span>
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-0">
        {article.title}
      </h1>
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getOne(id!),
    enabled: Boolean(id),
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Could not share');
      }
    }
  };

  const authorLabel = article?.author?.username ?? 'Author';

  return (
    <div className="min-h-screen pt-16">
      <div className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          )}

          {isError && (
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
              <GlassCard className="overflow-hidden relative">
                {article.coverImageUrl && (
                  <div className="h-96 overflow-hidden">
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8 md:p-12 relative z-10">
                  <ArticleHeader article={article} />

                  {article.project?.name ? (
                    <div className="mt-6 mb-2">
                      <ProjectNameBadge name={article.project.name} />
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span>{authorLabel}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar size={18} />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>

                    <button
                      type="button"
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
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
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
