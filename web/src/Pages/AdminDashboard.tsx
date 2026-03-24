import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader2, FileText, Eye, Calendar, CheckCircle, Users, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI, projectsAPI } from '../services/api.ts';
import { Article, Project } from '../Types/types';
import { useState, type FormEvent } from 'react';
import axios from 'axios';

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

interface PendingUser {
  id: string;
  username: string;
  role: string;
  isValidated: boolean;
  createdAt: string;
}

const API_URL = 'http://localhost:3008/api';

// Helper function to decode JWT and check if user is admin
const decodeToken = (token: string): { role: string; sub: string; username: string } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'articles' | 'users'>('articles');
  const [newProjectName, setNewProjectName] = useState('');

  // Check if user is admin by decoding JWT token
  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : null;
  const isAdmin = decodedToken?.role === 'admin';

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => articlesAPI.getAllForUser(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll(),
    enabled: activeTab === 'articles',
  });

  const createProjectMutation = useMutation({
    mutationFn: (name: string) => projectsAPI.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProjectName('');
      toast.success('Project created');
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error('A project with this name already exists');
      } else {
        toast.error('Failed to create project');
      }
    },
  });

  const { data: pendingUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/auth/pending-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: isAdmin && activeTab === 'users',
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

  const validateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.post(
        `${API_URL}/auth/validate-user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      refetchUsers();
      toast.success('User validated successfully');
    },
    onError: () => {
      toast.error('Failed to validate user');
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleValidateUser = async (userId: string) => {
    validateUserMutation.mutate(userId);
  };

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    const name = newProjectName.trim();
    if (!name) {
      toast.error('Enter a project name');
      return;
    }
    createProjectMutation.mutate(name);
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
                Manage articles and validate users
              </p>
            </motion.div>
            
            {activeTab === 'articles' && (
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
            )}
          </div>

          {/* Tabs */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex space-x-2 mt-8"
            >
              <button
                onClick={() => setActiveTab('articles')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'articles'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FileText size={20} />
                <span>Articles</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'users'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Users size={20} />
                <span>Pending Users</span>
                {pendingUsers && pendingUsers.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
            </motion.div>
          )}

          {/* Stats Cards - Only show for articles tab */}
          {activeTab === 'articles' && (
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
          )}
        </div>
      </section>

      {/* Content Section */}
      <div className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-10"
              >
                <GlassCard className="p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Briefcase className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                      <p className="text-gray-600 text-sm">Create programs or themes, then assign articles when you edit them.</p>
                    </div>
                  </div>
                  <form onSubmit={handleAddProject} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project name (e.g. Erasmus+ Mobility)"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white"
                    />
                    <button
                      type="submit"
                      disabled={createProjectMutation.isPending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {createProjectMutation.isPending ? 'Adding…' : 'Add project'}
                    </button>
                  </form>
                  {projects.length === 0 ? (
                    <p className="text-gray-500 text-sm">No projects yet. Add one above before creating articles.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {projects.map((p: Project) => (
                        <li
                          key={p.id}
                          className="rounded-lg bg-blue-50 text-blue-800 px-3 py-1.5 text-sm font-medium border border-blue-100"
                        >
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassCard>
              </motion.div>

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
                                      {(article.author.username || article.author.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-700">{article.author.username || article.author.username || 'Unknown'}</span>
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
                                  {(article.author.username || article.author.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700 text-sm">{article.author.username || article.author.username || 'Unknown'}</span>
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
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && isAdmin && (
            <>
              {isLoadingUsers && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32"
                >
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={64} />
                  <p className="text-gray-600 text-lg">Loading pending users...</p>
                </motion.div>
              )}

              {pendingUsers && pendingUsers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="p-12 rounded-3xl text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <p className="text-gray-900 text-xl font-semibold mb-4">All users validated</p>
                    <p className="text-gray-600">There are no pending user validations at the moment</p>
                  </GlassCard>
                </motion.div>
              )}

              {pendingUsers && pendingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <GlassCard className="overflow-hidden rounded-3xl">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Username</th>
                              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Role</th>
                              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Registered</th>
                              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                              <th className="px-6 py-4 text-center text-gray-900 font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {pendingUsers.map((user: PendingUser, index: number) => (
                              <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="hover:bg-blue-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                                      {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-900 font-medium">{user.username}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  <div className="flex items-center space-x-2">
                                    <Calendar size={16} />
                                    <span>{formatDate(user.createdAt)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    Pending
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => handleValidateUser(user.id)}
                                      disabled={validateUserMutation.isPending}
                                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <CheckCircle size={18} />
                                      <span>Validate</span>
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
                  <div className="md:hidden space-y-4">
                    {pendingUsers.map((user: PendingUser, index: number) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <GlassCard className="p-4 rounded-2xl">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-lg font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900 font-semibold">{user.username}</p>
                                <p className="text-gray-500 text-sm">{formatDate(user.createdAt)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                                  {user.role}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                  Pending
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleValidateUser(user.id)}
                              disabled={validateUserMutation.isPending}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle size={20} />
                              <span>Validate User</span>
                            </button>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}