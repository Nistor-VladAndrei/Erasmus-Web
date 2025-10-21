import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // or whatever loader you use
import GlassCard from '../components/GlassCard.tsx'; // adjust import path
// import types and helpers
// import { Article } from '../Types/types';
// import { formatDate } from '../utils/date'; // if you have this
// import { handleShare } from './...'; // your share handler

interface Props {
  isLoading: boolean;
  error?: string | null;
  article?: any; // swap for your Article type
  handleShare: () => void;
  formatDate: (iso: string) => string;
}

function ArticleHeader({ article }: { article: any }) {

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

export default function ArticlePage({
  isLoading,
  error,
  article,
  handleShare,
  formatDate,
}: Props) {
  return (
    // make sure this top-level padding matches your header height (h-16 => pt-16)
    <div className="min-h-screen pt-16">
      <div className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
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
              {/* Make the card relative so content z-indexing is predictable */}
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

                {/* content block sits above the image */}
                <div className="p-8 md:p-12 relative z-10">
                  {/* Header that includes the Back link + H1 */}
                  <ArticleHeader article={article} />

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
