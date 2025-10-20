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
} from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { articlesAPI, uploadAPI } from '../services/api.ts';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
          class: 'text-eu-yellow hover:underline',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-4',
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

  saveMutation.mutate({
    title,
    excerpt,
    content,
    coverImageUrl: coverImageUrl || undefined,
    published,
  });
};


  if (isEditMode && !article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 text-white hover:text-eu-yellow transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <motion.h1
            className="text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <GlassCard className="p-8 mb-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-white font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eu-yellow"
                    placeholder="Enter article title"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-white font-medium mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eu-yellow resize-none"
                    placeholder="Brief description of the article"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label htmlFor="coverImage" className="block text-white font-medium mb-2">
                    Cover Image URL
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      id="coverImage"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eu-yellow"
                      placeholder="https://example.com/image.jpg"
                    />
                    <label className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium cursor-pointer transition-colors flex items-center space-x-2">
                      <ImageIcon size={18} />
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
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Published Status */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-eu-yellow focus:ring-2 focus:ring-eu-yellow"
                />
        <label htmlFor="published" className="text-white font-medium cursor-pointer">
        Published
        </label>
    </div>
    </div>
</GlassCard>
          {/* Editor Toolbar */}
        <GlassCard className="p-4 mb-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('bold') ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Bold"
            >
              <Bold size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('italic') ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Italic"
            >
              <Italic size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('bulletList') ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Bullet List"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('orderedList') ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
            <button
              type="button"
              onClick={triggerImageUpload}
              disabled={isUploading}
              className="p-2 rounded hover:bg-white/20 transition-colors text-white disabled:opacity-50"
              title="Insert Image"
            >
              <ImageIcon size={18} />
            </button>
            <button
              type="button"
              onClick={addLink}
              className={`p-2 rounded hover:bg-white/20 transition-colors ${
                editor?.isActive('link') ? 'bg-white/20 text-eu-yellow' : 'text-white'
              }`}
              title="Add Link"
            >
              <LinkIcon size={18} />
            </button>
          </div>
        </GlassCard>

        {/* Content Editor */}
        <GlassCard className="mb-6">
          <label className="block text-white font-medium p-6 pb-0">
            Content *
          </label>
          <EditorContent editor={editor} />
        </GlassCard>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/admin"
            className="px-6 py-3 glass rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending || isUploading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-eu-blue to-blue-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </form>
    </div>
  </div>
</div>
);
}
