import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '../components/Header.tsx';
import ArticleCard from '../components/ArticleCard.tsx';
import { articlesAPI } from '../services/api.ts';
import { Loader2 } from 'lucide-react';

export default function News() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesAPI.getAll(1, 20),
  });

  return (
    <div className="min-h-screen">
      <Header />

       <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Latest News & Updates
            </h1>
            <p className="text-xl text-white/80">
              Stay informed about our Erasmus+ projects and activities
            </p>
          </motion.div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-300 text-lg">
                Failed to load articles. Please try again later.
              </p>
            </div>
          )}

          {data && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.data.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}

          {data && data.data.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/70 text-lg">
                No articles found. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
