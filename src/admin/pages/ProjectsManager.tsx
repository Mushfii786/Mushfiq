import React, { useState, useRef } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Grid,
  List,
  Upload,
  Trash2,
  Edit2,
  Copy,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Github,
  Tag,
  BarChart2
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { FirestoreProjectItem } from '../../types/admin';
import { uploadMediaToStorage, deleteMediaFromStorage } from '../../services/mediaService';

const PROJECT_CATEGORIES = ['All', 'UI/UX', 'Branding', 'Development', '3D & Motion', 'Visual Design'];

export function ProjectsManager() {
  const { projects, updateProject, deleteProject, updateProjectOrder } = useSiteContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<FirestoreProjectItem> | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAddNew = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      longDescription: '',
      role: 'Lead UI/UX & Frontend Developer',
      year: new Date().getFullYear().toString(),
      category: 'UI/UX',
      image: '',
      gallery: [],
      tags: ['React', 'Tailwind', 'Design'],
      link: '',
      github: '',
      featured: true,
      published: true,
      sortOrder: projects.length,
      metrics: [
        { label: 'Speed Score', value: '99/100' },
        { label: 'Engagement', value: '+45%' },
      ],
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (project: FirestoreProjectItem) => {
    setEditingProject({ ...project });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleDuplicate = async (project: FirestoreProjectItem) => {
    const duplicated: FirestoreProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
      sortOrder: projects.length,
    };
    await updateProject(duplicated);
    showToast(`Duplicated "${project.title}"`);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredProjects.length) return;

    const currentItem = filteredProjects[index];
    const targetItem = filteredProjects[newIndex];

    const updatedIds = projects.map((p) => {
      if (p.id === currentItem.id) return targetItem.id;
      if (p.id === targetItem.id) return currentItem.id;
      return p.id;
    });

    await updateProjectOrder(updatedIds);
    showToast('Updated projects order');
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setFormError(null);

    try {
      const result = await uploadMediaToStorage(file, 'photos', (percent) => {
        setUploadProgress(percent);
      });
      setEditingProject((prev) => ({
        ...prev,
        image: result.url,
        imageStoragePath: result.storagePath,
      }));
      showToast('Project cover image uploaded!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !editingProject) return;
    const current = editingProject.tags || [];
    if (!current.includes(tagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tags: [...current, tagInput.trim()],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tags: (editingProject.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleSave = async () => {
    if (!editingProject || !editingProject.title || !editingProject.image) {
      setFormError('Title and cover image are required.');
      return;
    }

    const payload: FirestoreProjectItem = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title.trim(),
      subtitle: editingProject.subtitle?.trim() || '',
      description: editingProject.description?.trim() || '',
      longDescription: editingProject.longDescription?.trim() || '',
      role: editingProject.role?.trim() || '',
      year: editingProject.year?.trim() || new Date().getFullYear().toString(),
      category: editingProject.category || 'UI/UX',
      image: editingProject.image.trim(),
      imageStoragePath: editingProject.imageStoragePath,
      gallery: editingProject.gallery || [],
      tags: editingProject.tags || [],
      link: editingProject.link?.trim() || '',
      github: editingProject.github?.trim() || '',
      featured: Boolean(editingProject.featured),
      published: editingProject.published !== false,
      sortOrder: typeof editingProject.sortOrder === 'number' ? editingProject.sortOrder : projects.length,
      metrics: editingProject.metrics || [],
    };

    await updateProject(payload);
    setIsEditModalOpen(false);
    setEditingProject(null);
    showToast(`Saved project "${payload.title}"`);
  };

  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    const proj = projects.find((p) => p.id === isDeletingId);
    if (proj) {
      if (proj.imageStoragePath) {
        await deleteMediaFromStorage(proj.imageStoragePath);
      }
      await deleteProject(isDeletingId);
      showToast(`Deleted "${proj.title}"`);
    }
    setIsDeletingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-blue-500" />
            <span>Portfolio Projects Management</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your design case studies, web development apps, and client projects rendered on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid / List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151b] border border-neutral-800/80 space-y-3">
          <FolderGit2 className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No projects found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filter.'
              : 'Add your first project case study to display on your portfolio.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-[#12151b] border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all duration-200 flex flex-col shadow-md"
            >
              <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-md ${
                      project.published
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-900/80 text-neutral-400 border border-neutral-700/50'
                    }`}
                  >
                    {project.published ? 'Live' : 'Draft'}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-neutral-800 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === filteredProjects.length - 1}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                    <span className="text-orange-400">{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                    {project.role}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(project)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      title="Edit project"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeletingId(project.id)}
                      title="Delete project"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#12151b] border border-neutral-800/80 overflow-hidden divide-y divide-neutral-800/60 shadow-md">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-10 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {project.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        project.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {project.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {project.category} • {project.year} • {project.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === filteredProjects.length - 1}
                  className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(project.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditModalOpen && editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#141720] border border-neutral-700 rounded-2xl shadow-2xl p-5 sm:p-7 space-y-5 my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-orange-400" />
                <span>{editingProject.id ? 'Edit Project' : 'Add New Project'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Project Cover Image *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-orange-500/70 rounded-xl p-4 text-center bg-neutral-900/60 hover:bg-neutral-900 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
                {isUploading ? (
                  <div className="space-y-1">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin mx-auto" />
                    <span className="text-xs text-neutral-300">Uploading cover image...</span>
                  </div>
                ) : editingProject.image ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={editingProject.image} alt="Cover" className="w-16 h-12 object-cover rounded-lg" />
                    <span className="text-xs text-neutral-300">Click to change cover image</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 text-neutral-500 group-hover:text-orange-400 mx-auto" />
                    <span className="text-xs text-neutral-300 block">Click to upload cover image</span>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Or enter remote image URL..."
                value={editingProject.image || ''}
                onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Loom Studio"
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Category</label>
                <select
                  value={editingProject.category || 'UI/UX'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {PROJECT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Short Subtitle</label>
                <input
                  type="text"
                  placeholder="AI Writing & Editorial Canvas"
                  value={editingProject.subtitle || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="High level summary of the project..."
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Role</label>
                <input
                  type="text"
                  placeholder="Lead UI/UX & Frontend Developer"
                  value={editingProject.role || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Year</label>
                <input
                  type="text"
                  placeholder="2025"
                  value={editingProject.year || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Live Website URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingProject.link || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">GitHub Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={editingProject.github || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Tags */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-medium text-neutral-300">Tech Stack & Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js 16, Three.js, Figma"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(editingProject.tags || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingProject.published !== false}
                  onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Publish to Live Site</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingProject.featured)}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Featured Project</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUploading}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Save Project
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsDeletingId(null)}
        >
          <div
            className="w-full max-w-sm bg-[#141720] border border-neutral-700 rounded-2xl p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-bold text-white">Delete Project?</h3>
              <p className="text-xs text-neutral-400">
                This will remove the project card and its case study information from your live website.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
