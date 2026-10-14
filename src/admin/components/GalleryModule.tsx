import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Photo } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Camera, 
  MapPin, 
  X, 
  Check, 
  Image as ImageIcon,
  Sliders,
  ExternalLink
} from 'lucide-react';

export function GalleryModule() {
  const { galleryImages, saveGalleryImage, deleteGalleryImage } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<Photo> | null>(null);

  const filtered = galleryImages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingPhoto({
      title: 'New Photograph',
      category: 'Photography',
      url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1200&h=800',
      caption: 'Atmospheric scene captured with cinematic lighting.',
      location: 'Malappuram, Kerala',
      camera: 'Sony A7IV',
      lens: '35mm f/1.4 GM',
      settings: 'f/1.8 • 1/500s • ISO 200',
      year: '2026 Archive',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (photo: Photo) => {
    setEditingPhoto({ ...photo });
    setIsEditModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto?.title || !editingPhoto?.url) return;
    await saveGalleryImage(editingPhoto);
    setIsEditModalOpen(false);
    setEditingPhoto(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Gallery & Media Archive
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Manage your high-resolution photographs, location tags, and camera metadata.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search photo archive by title or location..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#17181B] border border-[#2C2E34] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-xl bg-[#17181B] border border-[#2C2E34] overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition-all"
          >
            <div className="relative aspect-4/3 bg-[#111214] overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[10px] text-white/90 line-clamp-1">{photo.caption}</span>
              </div>
            </div>

            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">{photo.title}</h4>
                <span className="text-[10px] font-mono text-[#71717A]">{photo.year}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#A1A1AA] truncate">
                <MapPin className="w-2.5 h-2.5 shrink-0 text-purple-400" />
                <span className="truncate">{photo.location}</span>
              </div>
              {photo.camera && (
                <div className="flex items-center gap-1 text-[10px] text-[#71717A] font-mono truncate">
                  <Camera className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{photo.camera}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-[#2C2E34] flex items-center justify-end gap-1">
                <button
                  onClick={() => handleOpenEdit(photo)}
                  title="Edit Photo"
                  className="p-1 rounded text-[#71717A] hover:text-white hover:bg-[#202126] transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteGalleryImage(photo.id)}
                  title="Delete Photo"
                  className="p-1 rounded text-[#71717A] hover:text-red-400 hover:bg-[#202126] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Photo Modal */}
      {isEditModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2E34] pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingPhoto.id ? 'Edit Photograph' : 'Add New Photograph'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#71717A] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  placeholder="e.g. Monsoon Mood"
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.url || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  value={editingPhoto.caption || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="Atmospheric tone notes..."
                  className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1">Location</label>
                  <input
                    type="text"
                    value={editingPhoto.location || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                    placeholder="e.g. Malappuram, Kerala"
                    className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1">Camera Body</label>
                  <input
                    type="text"
                    value={editingPhoto.camera || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, camera: e.target.value })}
                    placeholder="e.g. Sony A7IV"
                    className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1">Lens</label>
                  <input
                    type="text"
                    value={editingPhoto.lens || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, lens: e.target.value })}
                    placeholder="e.g. 85mm f/1.4 GM"
                    className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1">Settings / Year</label>
                  <input
                    type="text"
                    value={editingPhoto.settings || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, settings: e.target.value })}
                    placeholder="f/1.8 • 1/500s • ISO 400"
                    className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2C2E34]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#202126] text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
