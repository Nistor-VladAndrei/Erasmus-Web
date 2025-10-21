import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader2, FileText, Eye, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI } from '../services/api.ts';
import { Article } from '../Types/types';

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

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => articlesAPI.getAllForAdmin(),
  });

  const deleteMutation = useMutation({
    mutationFn: articlesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/80 text-lg">
                Manage your articles and content
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/admin/article/new"
                className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Plus size={20} />
                <span>New Article</span>
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
          >
            <GlassCard className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 text-sm mb-1">Total Articles</p>
                  <p className="text-3xl font-bold text-black">{articles?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="text-black" size={24} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 text-sm mb-1">Published</p>
                  <p className="text-3xl font-bold text-black">
                    {articles?.filter((a: Article) => a.published).length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Eye className="text-black" size={24} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 text-sm mb-1">Drafts</p>
                  <p className="text-3xl font-bold text-black">
                    {articles?.filter((a: Article) => !a.published).length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="text-black" size={24} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <div className="py-12 px-4 sm:px-6">
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

          {articles && articles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-12 rounded-3xl text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-blue-600" size={40} />
                </div>
                <p className="text-gray-900 text-xl font-semibold mb-4">No articles yet</p>
                <p className="text-gray-600 mb-6">Start creating amazing content for your Erasmus+ program</p>
                <Link
                  to="/admin/article/new"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Plus size={20} />
                  <span>Create your first article</span>
                </Link>
              </GlassCard>
            </motion.div>
          )}

          {articles && articles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <GlassCard className="overflow-hidden rounded-3xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-gray-900 font-semibold">Article</th>
                          <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                          <th className="px-6 py-4 text-left text-gray-900 font-semibold">Author</th>
                          <th className="px-6 py-4 text-left text-gray-900 font-semibold">Date</th>
                          <th className="px-6 py-4 text-right text-gray-900 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {articles.map((article: Article, index: number) => (
                          <motion.tr
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-4">
                                {article.coverImageUrl && (
                                  <img
                                    src={article.coverImageUrl}
                                    alt={article.title}
                                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-gray-900 font-semibold truncate">{article.title}</p>
                                  <p className="text-gray-600 text-sm line-clamp-1">
                                    {article.excerpt}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  article.published
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {article.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                  {article.author.email.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700">{article.author.email.split('@')[0]}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>{formatDate(article.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/admin/article/${article.id}`}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                  title="Edit"
                                >
                                  <Edit2 className="text-gray-600 group-hover:text-blue-600" size={18} />
                                </Link>
                                <button
                                  onClick={() => handleDelete(article.id, article.title)}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                  title="Delete"
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="text-gray-600 group-hover:text-red-600" size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {articles.map((article: Article, index: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <GlassCard className="p-4 rounded-2xl">
                      {article.coverImageUrl && (
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="w-full h-40 rounded-xl object-cover mb-4"
                        />
                      )}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              article.published
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-gray-500 text-sm">{formatDate(article.createdAt)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                              {article.author.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700 text-sm">{article.author.email.split('@')[0]}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/article/${article.id}`}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="text-blue-600" size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="text-red-600" size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}