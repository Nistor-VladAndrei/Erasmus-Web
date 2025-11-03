import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { articlesAPI } from '../services/api.ts';
import { Loader2, Calendar, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header.tsx';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  createdAt: string;
  author: {
    username: string;
  };
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/90 border border-gray-200 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: (article: Article) => void;
}

function ArticleCard({ article, index, onClick }: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer h-full"
      onClick={() => onClick(article)}
    >
      <GlassCard className="overflow-hidden rounded-2xl h-full flex flex-col">
        {article.coverImageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
            <div className="flex items-center text-gray-500 text-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold mr-2">
                {article.author.username.charAt(0).toUpperCase()}
              </div>
              <span>{article.author.username}</span>
            </div>
            <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all">
              Read <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function News() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [scrolled, setScrolled] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesAPI.getAll(1, 20),
  });

  interface ArticlesResponse {
    data: Article[];
  }

  const filteredArticles: Article[] = data?.data?.filter((article: Article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async (article: Article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Article Detail View
  if (selectedArticle) {
     if(!scrolled) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setScrolled(true);
      }
    return (
      <>
        <div className="min-h-screen bg-white">
          {/* Hero Section with Cover Image */}
          <section className="relative h-[60vh] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {selectedArticle.coverImageUrl && (
                <>
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
                </>
              )}
            </motion.div>

            <div className="relative z-10 h-full flex items-center p-6 md:p-12 pt-16 md:pt-20">
              <div className="max-w-4xl w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col items-start"
                >
                  {/* Back button moved here so it sits immediately above the title */}
                  <motion.button
                    onClick={() => {
                      
                      setSelectedArticle(null)
                    }}
                    className="inline-flex items-center space-x-2 text-white hover:text-blue-300 transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    whileHover={{ x: -4 }}
                  >
                    <ArrowRight size={20} className="rotate-180" />
                    <span>Back to News</span>
                  </motion.button>

                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {selectedArticle.title}
                  </h1>
                  {selectedArticle.excerpt && (
                    <p className="text-xl text-white/90 font-light">
                      {selectedArticle.excerpt}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <div className="py-16 px-6">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <GlassCard className="rounded-3xl overflow-hidden">
                  <div className="p-8 md:p-12">
                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-12 pb-8 border-b border-gray-200">
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {selectedArticle.author.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Author</p>
                          <p className="font-medium text-gray-900">{selectedArticle.author.username.split('@')[0]}</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar size={20} className="text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Published</p>
                          <p className="font-medium text-gray-900">{formatDate(selectedArticle.createdAt)}</p>
                        </div>
                      </motion.div>
                      
                      <motion.button
                        onClick={() => handleShare(selectedArticle)}
                        className="ml-auto flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Share</span>
                        <ArrowRight size={18} />
                      </motion.button>
                    </div>

                    {/* Article Body */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                      style={{
                        color: '#374151',
                      }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>

         
        </div>
      </>
    );
}


  // News List View
  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-white pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Latest News & Updates
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-600 font-light mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Stay informed about our Erasmus+ projects and activities
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white shadow-lg transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <div className="pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="animate-spin text-blue-600 mb-4" size={64} />
              <p className="text-gray-600 text-lg">Loading articles...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <GlassCard className="p-12 rounded-3xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-red-600 text-lg font-medium mb-2">
                  Failed to load articles
                </p>
                <p className="text-gray-600">
                  Please try again later or contact support.
                </p>
              </GlassCard>
            </motion.div>
          )}

          {data && (
            <>
              {/* Results count */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <p className="text-gray-600 text-lg">
                  {searchQuery ? (
                    <>
                      Found <span className="font-semibold text-blue-600">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </>
                  ) : (
                    <>
                      Showing <span className="font-semibold text-blue-600">{data.data.length}</span> article{data.data.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </motion.div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article: Article, index: number) => (
                  <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                  onClick={setSelectedArticle}
                  />
                ))}
              </div>

              {/* Empty state for search */}
              {searchQuery && filteredArticles.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32"
                >
                  <GlassCard className="p-12 rounded-3xl max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-gray-400" size={40} />
                    </div>
                    <p className="text-gray-900 text-xl font-semibold mb-2">
                      No articles found
                    </p>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Clear search
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* Empty state for no articles */}
              {!searchQuery && data.data.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32"
                >
                  <GlassCard className="p-12 rounded-3xl max-w-md mx-auto">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📰</span>
                    </div>
                    <p className="text-gray-900 text-xl font-semibold mb-2">
                      No articles yet
                    </p>
                    <p className="text-gray-600">
                      Check back soon for updates and news about our Erasmus+ programs!
                    </p>
                  </GlassCard>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {data && data.data.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-12 md:p-16 rounded-3xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Want to be part of our story?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Learn more about our Erasmus+ programs and how you can participate
                </p>
                <button className="inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:shadow-xl transition-all transform hover:scale-105">
                  <span>Get Involved</span>
                  <ArrowRight size={22} />
                </button>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      )}
    </div>
    </>
  );
}