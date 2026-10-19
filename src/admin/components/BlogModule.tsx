import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { BlogPostItem } from '../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Calendar, 
  User, 
  Eye, 
  Sparkles, 
  X, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

export function BlogModule() {
  const { blogPosts, saveBlogPost, deleteBlogPost, siteSettings } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<Partial<BlogPostItem> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewingPost, setPreviewingPost] = useState<BlogPostItem | null>(null);

  const filteredPosts = blogPosts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: 'Write your insights, cinematography breakdowns, or design tutorials here...',
      category: 'Design & Visuals',
      tags: ['Portfolio', 'Creative'],
      author: siteSettings.siteTitle || 'Muhammed Mushfiq',
      status: 'published',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=800',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setIsEditorOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title) return;
    await saveBlogPost(editingPost);
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Blog & Article Publishing
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Write, curate, and publish design essays, photo tutorials, and creative thoughts.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or keyword..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#17181B] border border-[#2C2E34] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Posts Table / List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-xl bg-[#17181B] border border-[#2C2E34] hover:border-[#3E414A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
          >
            <div className="flex items-start gap-4 flex-1">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 bg-[#202126]"
                />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {post.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] line-clamp-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A] pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.publishedAt || post.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {post.author}
                  </span>
                  {post.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setPreviewingPost(post)}
                className="px-2.5 py-1.5 rounded bg-[#202126] hover:bg-[#282930] text-[#A1A1AA] hover:text-white text-xs transition-colors cursor-pointer"
              >
                Preview
              </button>
              <button
                onClick={() => handleOpenEdit(post)}
                className="p-1.5 rounded bg-[#202126] hover:bg-[#282930] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteBlogPost(post.id)}
                className="p-1.5 rounded bg-[#202126] hover:bg-[#282930] text-[#A1A1AA] hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Preview Modal */}
      {previewingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setPreviewingPost(null)}
              className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
            </button>

            {previewingPost.coverImage && (
              <img
                src={previewingPost.coverImage}
                alt={previewingPost.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            )}

            <div>
              <span className="text-xs font-mono text-purple-400 uppercase">{previewingPost.category}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{previewingPost.title}</h1>
              <p className="text-xs font-mono text-[#71717A] mt-2">
                Published on {previewingPost.publishedAt} by {previewingPost.author}
              </p>
            </div>

            <div className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap font-sans">
              {previewingPost.content}
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C2E34]">
              <h3 className="text-sm font-bold text-white">
                {editingPost.id ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-[#71717A] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="e.g. The Art of Cinematic Motion"
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500 font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="e.g. art-of-cinematic-motion"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="e.g. Photography, Design"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="A short punchy preview of the article..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingPost.coverImage || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Article Body (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Write in Markdown format..."
                  className="w-full p-3 rounded bg-[#111214] border border-[#2C2E34] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#A1A1AA] font-mono">Status:</span>
                  <select
                    value={editingPost.status || 'published'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                    className="p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded bg-[#202126] text-[#A1A1AA] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    Save Article
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
