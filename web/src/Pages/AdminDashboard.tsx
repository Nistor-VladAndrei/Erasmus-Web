import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { articlesAPI } from '../services/api.ts';
import { Article } from '../Types/types';

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
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              className="text-4xl font-bold text-white"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Admin Dashboard
            </motion.h1>
            <Link
              to="/admin/article/new"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-eu-blue to-blue-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              <span>New Article</span>
            </Link>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          )}

          {articles && articles.length === 0 && (
            <GlassCard className="p-12 text-center">
              <p className="text-white/70 text-lg mb-4">No articles yet</p>
              <Link
                to="/admin/article/new"
                className="inline-flex items-center space-x-2 text-eu-yellow hover:text-yellow-300 transition-colors"
              >
                <Plus size={20} />
                <span>Create your first article</span>
              </Link>
            </GlassCard>
          )}

          {articles && articles.length > 0 && (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Title</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Author</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                      <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {articles.map((article: Article) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {article.coverImageUrl && (
                              <img
                                src={article.coverImageUrl}
                                alt={article.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{article.title}</p>
                              <p className="text-white/60 text-sm line-clamp-1">
                                {article.excerpt}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              article.published
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {article.author.email.split('@')[0]}
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/article/${article.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="text-white/70 hover:text-white" size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="text-red-300 hover:text-red-200" size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}