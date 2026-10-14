import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Project } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Star, 
  X, 
  Check, 
  Filter, 
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export function ProjectsModule() {
  const { projects, saveProject, deleteProject } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = ['All', 'UI/UX', 'Branding', 'Development', '3D & Motion'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      subtitle: '',
      description: '',
      longDescription: '',
      role: 'Creative Designer & Developer',
      year: new Date().getFullYear().toString(),
      category: 'UI/UX',
      image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200&h=800',
      tags: ['Design System', 'React 19'],
      featured: true,
      link: '',
      github: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDuplicate = (project: Project) => {
    const copy: Partial<Project> = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
    };
    saveProject(copy);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    await saveProject(editingProject);
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Projects & Showcase Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Manage your selected portfolio case studies, live links, and descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#17181B] border border-[#2C2E34] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-[#17181B] text-[#A1A1AA] hover:text-white border border-[#2C2E34]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl bg-[#17181B] border border-[#2C2E34] overflow-hidden flex flex-col justify-between group hover:border-[#3E414A] transition-all"
          >
            {/* Image Preview */}
            <div className="relative h-40 bg-[#111214] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-white/10 uppercase">
                  {project.category || 'Work'}
                </span>
                {project.featured && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/80 text-black text-[10px] font-mono font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">{project.subtitle}</p>
                )}
                <p className="text-xs text-[#71717A] line-clamp-2 mt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags & Action Bar */}
              <div className="pt-3 border-t border-[#2C2E34] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#71717A]">{project.year || '2026'}</span>

                <div className="flex items-center gap-1 text-[#A1A1AA]">
                  <button
                    onClick={() => handleDuplicate(project)}
                    title="Duplicate Project"
                    className="p-1.5 rounded hover:bg-[#202126] hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    title="Edit Project"
                    className="p-1.5 rounded hover:bg-[#202126] hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(project.id)}
                    title="Delete Project"
                    className="p-1.5 rounded hover:bg-[#202126] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
            <h3 className="text-sm font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-[#A1A1AA]">
              Are you sure you want to delete this project? This will remove it from the showcase.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded bg-[#202126] text-xs text-[#A1A1AA] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProject(deletingId);
                  setDeletingId(null);
                }}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-xs text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C2E34]">
              <h3 className="text-sm font-bold text-white">
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-[#71717A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Loom Studio"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    placeholder="e.g. AI Writing & Editorial Canvas"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Category</label>
                  <select
                    value={editingProject.category || 'UI/UX'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="UI/UX">UI/UX</option>
                    <option value="Branding">Branding</option>
                    <option value="Development">Development</option>
                    <option value="3D & Motion">3D & Motion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Role</label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    placeholder="e.g. Lead Designer"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    placeholder="2026"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Summary shown on project cards..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Case Study / Full Story</label>
                <textarea
                  rows={4}
                  value={editingProject.longDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  placeholder="Detailed breakdown of challenges, architecture, and impact..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Live Project Link</label>
                  <input
                    type="text"
                    value={editingProject.link || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">GitHub Repository Link</label>
                  <input
                    type="text"
                    value={editingProject.github || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="accent-purple-500 rounded"
                />
                <label htmlFor="featuredToggle" className="text-xs text-white cursor-pointer select-none">
                  Highlight as Featured Project on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#2C2E34]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#202126] hover:bg-[#282930] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-sm transition-colors"
                >
                  Save Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
