import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Upload,
  Trash2,
  Edit2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  X,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { FirestorePhotoItem } from '../../types/admin';
import { uploadMediaToStorage, deleteMediaFromStorage } from '../../services/mediaService';

const CATEGORIES = ['All', 'Landscapes', 'Desert Routes', 'Architecture', 'Sunset & Stars', 'Culture', 'Portraits'];

export function PhotographyManager() {
  const { photos, updatePhoto, deletePhoto, updatePhotoOrder, isFirebaseActive } = useSiteContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<FirestorePhotoItem> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered photos
  const filteredPhotos = photos
    .filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Start new photo creation
  const handleAddNewPhoto = () => {
    setEditingPhoto({
      id: `photo-${Date.now()}`,
      title: '',
      caption: '',
      description: '',
      category: 'Landscapes',
      url: '',
      location: '',
      camera: 'Sony A7IV',
      lens: '35mm f/1.4 GM',
      settings: '1/400s • f/2.8 • ISO 100',
      year: new Date().getFullYear().toString(),
      featured: false,
      published: true,
      sortOrder: photos.length,
      tags: [],
    });
    setUploadError(null);
    setIsEditModalOpen(true);
  };

  // Start editing existing photo
  const handleEdit = (photo: FirestorePhotoItem) => {
    setEditingPhoto({ ...photo });
    setUploadError(null);
    setIsEditModalOpen(true);
  };

  // Duplicate photo
  const handleDuplicate = async (photo: FirestorePhotoItem) => {
    const duplicated: FirestorePhotoItem = {
      ...photo,
      id: `photo-${Date.now()}`,
      title: `${photo.title} (Copy)`,
      sortOrder: photos.length,
    };
    await updatePhoto(duplicated);
    showToast(`Duplicated "${photo.title}"`);
  };

  // Reorder photo up/down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredPhotos.length) return;

    const currentItem = filteredPhotos[index];
    const targetItem = filteredPhotos[newIndex];

    const updatedIds = photos.map((p) => {
      if (p.id === currentItem.id) return targetItem.id;
      if (p.id === targetItem.id) return currentItem.id;
      return p.id;
    });

    await updatePhotoOrder(updatedIds);
    showToast('Updated gallery display order');
  };

  // File upload directly from the modal or dropzone
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Please upload an image (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds 25MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const result = await uploadMediaToStorage(file, 'photos', (percent) => {
        setUploadProgress(percent);
      });

      setEditingPhoto((prev) => ({
        ...prev,
        url: result.url,
        storagePath: result.storagePath,
        title: prev?.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));

      showToast('Image uploaded successfully to Firebase Storage!');
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Save changes to Firestore
  const handleSavePhoto = async () => {
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.url) {
      setUploadError('Title and an image URL are required.');
      return;
    }

    const payload: FirestorePhotoItem = {
      id: editingPhoto.id || `photo-${Date.now()}`,
      title: editingPhoto.title.trim(),
      caption: editingPhoto.caption?.trim() || '',
      description: editingPhoto.description?.trim() || '',
      category: editingPhoto.category || 'Landscapes',
      url: editingPhoto.url.trim(),
      storagePath: editingPhoto.storagePath,
      altText: editingPhoto.altText?.trim() || editingPhoto.title,
      location: editingPhoto.location?.trim() || '',
      camera: editingPhoto.camera?.trim() || '',
      lens: editingPhoto.lens?.trim() || '',
      settings: editingPhoto.settings?.trim() || '',
      year: editingPhoto.year || new Date().getFullYear().toString(),
      featured: Boolean(editingPhoto.featured),
      published: editingPhoto.published !== false,
      sortOrder: typeof editingPhoto.sortOrder === 'number' ? editingPhoto.sortOrder : photos.length,
      tags: editingPhoto.tags || [],
    };

    await updatePhoto(payload);
    setIsEditModalOpen(false);
    setEditingPhoto(null);
    showToast(`Saved "${payload.title}" successfully`);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    const photoToDelete = photos.find((p) => p.id === isDeletingId);
    if (photoToDelete) {
      if (photoToDelete.storagePath) {
        await deleteMediaFromStorage(photoToDelete.storagePath);
      }
      await deletePhoto(isDeletingId);
      showToast(`Deleted "${photoToDelete.title}"`);
    }
    setIsDeletingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-orange-500" />
            <span>Photography Gallery Management</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Upload, organize, reorder, and configure photos shown across the public website and full-screen gallery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewPhoto}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Photo Content Display */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151b] border border-neutral-800/80 space-y-3">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No photographs found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filter.'
              : 'Add your first photograph to begin showcasing your creative visual captures.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group rounded-2xl bg-[#12151b] border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all duration-200 flex flex-col shadow-md"
            >
              {/* Photo Preview Container */}
              <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-md ${
                      photo.published
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-900/80 text-neutral-400 border border-neutral-700/50'
                    }`}
                  >
                    {photo.published ? 'Live' : 'Draft'}
                  </span>
                  {photo.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-orange-950/80 text-orange-300 border border-orange-500/30">
                      Featured
                    </span>
                  )}
                </div>

                {/* Reorder Buttons Overlay */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-neutral-800 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move earlier"
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === filteredPhotos.length - 1}
                    title="Move later"
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                    <span className="text-orange-400">{photo.category}</span>
                    <span>{photo.year || '2026'}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {photo.caption || 'No caption provided.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                    {photo.location || photo.camera || 'No camera info'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(photo)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(photo)}
                      title="Edit photo"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeletingId(photo.id)}
                      title="Delete photo"
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
        /* LIST VIEW */
        <div className="rounded-2xl bg-[#12151b] border border-neutral-800/80 overflow-hidden divide-y divide-neutral-800/60 shadow-md">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {photo.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        photo.published
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {photo.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {photo.category} • {photo.location || 'Unknown location'} • {photo.year || '2026'}
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
                  disabled={index === filteredPhotos.length - 1}
                  className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(photo)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(photo.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit & Create Modal */}
      {isEditModalOpen && editingPhoto && (
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
                <Camera className="w-4 h-4 text-orange-400" />
                <span>{editingPhoto.id ? 'Edit Photograph' : 'Add New Photograph'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Banner */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Media Upload / URL Input */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-300">
                Image Source (Upload to Firebase Storage or Enter URL)
              </label>

              {/* Drag and Drop Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-orange-500/70 rounded-xl p-5 text-center bg-neutral-900/60 hover:bg-neutral-900 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                {isUploading ? (
                  <div className="space-y-2">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
                    <span className="text-xs text-neutral-300">
                      Uploading to Firebase Storage ({uploadProgress || 0}%)...
                    </span>
                    <div className="w-48 h-1.5 bg-neutral-800 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-200"
                        style={{ width: `${uploadProgress || 0}%` }}
                      />
                    </div>
                  </div>
                ) : editingPhoto.url ? (
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={editingPhoto.url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-neutral-700"
                    />
                    <div className="text-left text-xs">
                      <span className="font-semibold text-white block">Image loaded</span>
                      <span className="text-neutral-400 text-[11px]">Click to replace file</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="w-6 h-6 text-neutral-500 group-hover:text-orange-400 mx-auto transition-colors" />
                    <span className="text-xs font-medium text-neutral-300 block">
                      Drag and drop image here, or browse files
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      JPG, PNG, WebP (Max 25MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Or manual URL */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400">Or remote image URL:</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingPhoto.url || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, url: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="AlUla Rock Formations"
                  value={editingPhoto.title || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Category</label>
                <select
                  value={editingPhoto.category || 'Landscapes'}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Caption</label>
                <input
                  type="text"
                  placeholder="Short editorial summary..."
                  value={editingPhoto.caption || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Full Description</label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive narrative and backstory..."
                  value={editingPhoto.description || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Location</label>
                <input
                  type="text"
                  placeholder="e.g. AlUla Valley, Saudi Arabia"
                  value={editingPhoto.location || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Year / Date</label>
                <input
                  type="text"
                  placeholder="e.g. 2026 Archive"
                  value={editingPhoto.year || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, year: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Camera Body</label>
                <input
                  type="text"
                  placeholder="e.g. Sony A7IV"
                  value={editingPhoto.camera || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, camera: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Lens & Optics</label>
                <input
                  type="text"
                  placeholder="e.g. 35mm f/1.4 GM"
                  value={editingPhoto.lens || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, lens: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Camera Settings</label>
                <input
                  type="text"
                  placeholder="e.g. 1/500s • f/2.8 • ISO 100"
                  value={editingPhoto.settings || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, settings: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

            </div>

            {/* Checkboxes: Published & Featured */}
            <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingPhoto.published !== false}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, published: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Publish to Live Website</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingPhoto.featured)}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Featured in CoverFlow Carousel</span>
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
                onClick={handleSavePhoto}
                disabled={isUploading}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Save & Update Gallery
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
              <h3 className="text-sm font-bold text-white">Delete Photograph?</h3>
              <p className="text-xs text-neutral-400">
                This will permanently remove this photograph from Firestore and your public website gallery.
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
