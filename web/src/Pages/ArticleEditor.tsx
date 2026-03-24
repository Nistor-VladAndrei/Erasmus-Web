import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  FileText,
  Upload,
  Heading1,
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard.tsx';
import { articlesAPI, uploadAPI, projectsAPI } from '../services/api.ts';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [projectId, setProjectId] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll(),
  });

  // Fetch article if editing
  const { data: article } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getOne(id!),
    enabled: isEditMode,
  });

  // TipTap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4 text-gray-900',
      },
    },
  });

  // Load article data when editing
  useEffect(() => {
    if (article && editor) {
      setTitle(article.title);
      setExcerpt(article.excerpt);
      setCoverImageUrl(article.coverImageUrl || '');
      setPublished(article.published);
      setProjectId(article.projectId ?? '');
      editor.commands.setContent(article.content);
    }
  }, [article, editor]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode) {
        return articlesAPI.update(id!, data);
      }
      return articlesAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success(isEditMode ? 'Article updated successfully' : 'Article created successfully');
      navigate('/admin');
    },
    onError: () => {
      toast.error('Failed to save article');
    },
  });

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      editor.chain().focus().setImage({ src: response.url }).run();
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setCoverImageUrl(response.url);
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Failed to upload cover image');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input for image insertion
  const triggerImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  };

  // Add link
  const addLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (!editor) {
      toast.error('Editor not initialized');
      return;
    }

    const content = editor.getHTML();

    if (!title.trim() || !excerpt.trim() || !content || content === '<p></p>') {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!projectId) {
      toast.error('Please select a project');
      return;
    }

    saveMutation.mutate({
      title,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || undefined,
      published,
      projectId,
    });
  };

  if (isEditMode && !article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 pt-32 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-white/80 text-lg">
              {isEditMode ? 'Update your article content' : 'Share your Erasmus+ experience with the world'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Editor Section */}
      <div className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard className="p-6 sm:p-8 rounded-3xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white"
                      placeholder="Enter a catchy title for your article"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label htmlFor="excerpt" className="block text-gray-700 font-semibold mb-2">
                      Short Description *
                    </label>
                    <textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white resize-none"
                      placeholder="Write a brief description that will appear in the article preview"
                    />
                  </div>

                  {/* Project */}
                  <div>
                    <label htmlFor="projectId" className="block text-gray-700 font-semibold mb-2">
                      Project *
                    </label>
                    <select
                      id="projectId"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {projects.length === 0 && (
                      <p className="mt-2 text-sm text-amber-700">
                        No projects yet. Add one from the admin dashboard first.
                      </p>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label htmlFor="coverImage" className="block text-gray-700 font-semibold mb-2">
                      Cover Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="url"
                        id="coverImage"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg rounded-xl text-white font-semibold cursor-pointer transition-all flex items-center justify-center space-x-2">
                        <Upload size={18} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    {coverImageUrl && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={coverImageUrl}
                        alt="Cover preview"
                        className="mt-4 w-full h-64 object-cover rounded-xl"
                      />
                    )}
                  </div>

                  {/* Published Status */}
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-5 h-5 rounded bg-white border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="text-gray-900 font-medium cursor-pointer flex items-center space-x-2">
                      <Eye size={18} />
                      <span>Publish immediately</span>
                    </label>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Editor Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-4 rounded-2xl">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Bold"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Italic"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Heading 1"
                  >
                    <Heading1 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Bullet List"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Numbered List"
                  >
                    <ListOrdered size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    disabled={isUploading}
                    className="p-3 rounded-xl hover:bg-blue-100 transition-colors text-gray-700 disabled:opacity-50"
                    title="Insert Image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={addLink}
                    className={`p-3 rounded-xl hover:bg-blue-100 transition-colors ${
                      editor?.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                    title="Add Link"
                  >
                    <LinkIcon size={18} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard className="rounded-3xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Article Content *</h2>
                  <p className="text-gray-600 text-sm mt-1">Write your article content below</p>
                </div>
                <EditorContent editor={editor} />
              </GlassCard>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-end gap-4"
            >
              <Link
                to="/admin"
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saveMutation.isPending || isUploading}
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>{isEditMode ? 'Update Article' : 'Create Article'}</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}