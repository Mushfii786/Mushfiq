import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
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
  Play,
  Film,
  Camera,
  Scissors,
  Sparkles,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { FirestoreVideoItem } from '../../types/admin';
import { uploadMediaToStorage, deleteMediaFromStorage, dataUrlToBlob } from '../../services/mediaService';
import { captureVideoFrame } from '../../utils/videoStorage';
import { VideoThumbnailEditor } from '../../components/VideoThumbnailEditor';

const VIDEO_CATEGORIES = [
  'All',
  'Cinematic Reels',
  'Drone & FPV',
  'Commercial',
  'Motion & VFX',
  'Documentary',
  'Creative Direction'
];

export function VideographyManager() {
  const { videos, updateVideo, deleteVideo, updateVideoOrder, isFirebaseActive } = useSiteContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal & Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<FirestoreVideoItem> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video Upload & Progress
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);

  // Thumbnail Upload & Studio states
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState<number | null>(null);
  const [isThumbnailStudioOpen, setIsThumbnailStudioOpen] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered list
  const filteredVideos = videos
    .filter((v) => {
      const matchesCategory =
        selectedCategory === 'All' || v.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.location && v.location.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Start new video
  const handleAddNewVideo = () => {
    setEditingVideo({
      id: `video-${Date.now()}`,
      title: '',
      caption: '',
      description: '',
      category: 'Cinematic Reels',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '0:45',
      aspectRatioClass: 'aspect-[9/16]',
      location: '',
      camera: 'Sony FX3',
      lens: '35mm T1.5 Anamorphic',
      settings: '4K 60fps • S-Log3',
      year: new Date().getFullYear().toString() + ' Film',
      views: 1000,
      likes: 120,
      featured: false,
      published: true,
      sortOrder: videos.length,
      isCustom: true,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Edit existing
  const handleEdit = (video: FirestoreVideoItem) => {
    setEditingVideo({ ...video });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Duplicate video
  const handleDuplicate = async (video: FirestoreVideoItem) => {
    const duplicated: FirestoreVideoItem = {
      ...video,
      id: `video-${Date.now()}`,
      title: `${video.title} (Copy)`,
      sortOrder: videos.length,
    };
    await updateVideo(duplicated);
    showToast(`Duplicated "${video.title}"`);
  };

  // Reorder up/down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredVideos.length) return;

    const currentItem = filteredVideos[index];
    const targetItem = filteredVideos[newIndex];

    const updatedIds = videos.map((v) => {
      if (v.id === currentItem.id) return targetItem.id;
      if (v.id === targetItem.id) return currentItem.id;
      return v.id;
    });

    await updateVideoOrder(updatedIds);
    showToast('Updated videography display order');
  };

  // Video file upload
  const handleVideoFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (MP4, WebM).');
      return;
    }
    if (file.size > 250 * 1024 * 1024) {
      setFormError('File size exceeds the 250MB limit.');
      return;
    }

    setIsUploadingVideo(true);
    setFormError(null);
    setVideoUploadProgress(0);

    try {
      // 1. Capture automatic thumbnail from first frame
      try {
        const frame = await captureVideoFrame(file);
        if (frame.dataUrl && !editingVideo?.thumbnailUrl) {
          const thumbBlob = dataUrlToBlob(frame.dataUrl);
          const thumbResult = await uploadMediaToStorage(thumbBlob, 'thumbnails');
          setEditingVideo((prev) => ({
            ...prev,
            thumbnailUrl: thumbResult.url,
            thumbnailStoragePath: thumbResult.storagePath,
            aspectRatioClass: frame.aspectRatioClass || prev?.aspectRatioClass,
            duration: frame.duration ? `${Math.floor(frame.duration / 60)}:${Math.floor(frame.duration % 60).toString().padStart(2, '0')}` : prev?.duration,
          }));
        }
      } catch (e) {
        console.warn('Could not auto-generate thumbnail frame:', e);
      }

      // 2. Upload actual video file to Firebase Storage
      const result = await uploadMediaToStorage(file, 'videos', (percent) => {
        setVideoUploadProgress(percent);
      });

      setEditingVideo((prev) => ({
        ...prev,
        videoUrl: result.url,
        videoStoragePath: result.storagePath,
        title: prev?.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));

      showToast('Video reel uploaded successfully to Firebase Storage!');
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to upload video.');
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadProgress(null);
    }
  };

  // Manual thumbnail image upload
  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Thumbnail must be an image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingThumb(true);
    setThumbUploadProgress(0);

    try {
      const result = await uploadMediaToStorage(file, 'thumbnails', (percent) => {
        setThumbUploadProgress(percent);
      });

      setEditingVideo((prev) => ({
        ...prev,
        thumbnailUrl: result.url,
        thumbnailStoragePath: result.storagePath,
      }));

      showToast('Thumbnail uploaded and attached!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload thumbnail.');
    } finally {
      setIsUploadingThumb(false);
      setThumbUploadProgress(null);
    }
  };

  // Save thumbnail returned from VideoThumbnailEditor studio
  const handleSaveThumbnailFromStudio = async (dataUrl: string) => {
    setIsThumbnailStudioOpen(false);
    setIsUploadingThumb(true);
    try {
      const blob = dataUrlToBlob(dataUrl);
      const result = await uploadMediaToStorage(blob, 'thumbnails');
      setEditingVideo((prev) => ({
        ...prev,
        thumbnailUrl: result.url,
        thumbnailStoragePath: result.storagePath,
      }));
      showToast('Custom edited thumbnail saved and uploaded!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to save thumbnail.');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // Save complete video to Firestore
  const handleSaveVideo = async () => {
    if (!editingVideo || !editingVideo.title || !editingVideo.videoUrl) {
      setFormError('A title and a video URL or uploaded file are required.');
      return;
    }

    const payload: FirestoreVideoItem = {
      id: editingVideo.id || `video-${Date.now()}`,
      title: editingVideo.title.trim(),
      caption: editingVideo.caption?.trim() || '',
      description: editingVideo.description?.trim() || '',
      category: editingVideo.category || 'Cinematic Reels',
      videoUrl: editingVideo.videoUrl.trim(),
      videoStoragePath: editingVideo.videoStoragePath,
      thumbnailUrl: editingVideo.thumbnailUrl?.trim() || editingVideo.videoUrl,
      thumbnailStoragePath: editingVideo.thumbnailStoragePath,
      duration: editingVideo.duration?.trim() || '0:45',
      aspectRatioClass: editingVideo.aspectRatioClass || 'aspect-[9/16]',
      location: editingVideo.location?.trim() || '',
      camera: editingVideo.camera?.trim() || '',
      lens: editingVideo.lens?.trim() || '',
      settings: editingVideo.settings?.trim() || '',
      year: editingVideo.year || new Date().getFullYear().toString() + ' Film',
      views: editingVideo.views || 1000,
      likes: editingVideo.likes || 120,
      column: editingVideo.column || 1,
      featured: Boolean(editingVideo.featured),
      published: editingVideo.published !== false,
      sortOrder: typeof editingVideo.sortOrder === 'number' ? editingVideo.sortOrder : videos.length,
      isCustom: true,
    };

    await updateVideo(payload);
    setIsEditModalOpen(false);
    setEditingVideo(null);
    showToast(`Saved "${payload.title}" successfully`);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    const videoToDelete = videos.find((v) => v.id === isDeletingId);
    if (videoToDelete) {
      if (videoToDelete.videoStoragePath) {
        await deleteMediaFromStorage(videoToDelete.videoStoragePath);
      }
      if (videoToDelete.thumbnailStoragePath) {
        await deleteMediaFromStorage(videoToDelete.thumbnailStoragePath);
      }
      await deleteVideo(isDeletingId);
      showToast(`Deleted "${videoToDelete.title}"`);
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
            <Video className="w-6 h-6 text-orange-500" />
            <span>Videography & Cinematic Reels CMS</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Upload video files to Cloud Storage, design custom video poster thumbnails, and curate cinematic works for the live site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewVideo}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video Reel</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
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

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {VIDEO_CATEGORIES.map((cat) => (
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

      {/* Videos List / Grid */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151b] border border-neutral-800/80 space-y-3">
          <Film className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No video reels found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filter.'
              : 'Upload your first cinematic video reel to showcase it on your public portfolio.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className="group rounded-2xl bg-[#12151b] border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all duration-200 flex flex-col shadow-md"
            >
              {/* Thumbnail / Video Container */}
              <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
                <img
                  src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                  <Film className="w-3 h-3 text-orange-400" />
                  <span>{video.duration || '0:45'}</span>
                </div>

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-md ${
                      video.published
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-900/80 text-neutral-400 border border-neutral-700/50'
                    }`}
                  >
                    {video.published ? 'Live' : 'Draft'}
                  </span>
                  {video.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-orange-950/80 text-orange-300 border border-orange-500/30">
                      Featured
                    </span>
                  )}
                </div>

                {/* Reorder Buttons */}
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
                    disabled={index === filteredVideos.length - 1}
                    title="Move later"
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                    <span className="text-orange-400">{video.category}</span>
                    <span>{video.year || '2026 Film'}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {video.caption || video.description || 'No caption.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                    {video.location || video.camera || '4K Cinematic'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(video)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(video)}
                      title="Edit video reel"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeletingId(video.id)}
                      title="Delete video"
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
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-12 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800 relative">
                  <img
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white/80" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {video.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        video.published
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {video.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {video.category} • {video.duration} • {video.location || 'Location'}
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
                  disabled={index === filteredVideos.length - 1}
                  className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(video)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(video.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit & Upload Video Modal */}
      {isEditModalOpen && editingVideo && (
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
                <Video className="w-4 h-4 text-orange-400" />
                <span>{editingVideo.id ? 'Edit Video Reel' : 'Upload Video Reel'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Step 1: Video File Source */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-300">
                1. Video File Source (Upload to Firebase Storage or Google Drive / URL)
              </label>

              {/* Drag and Drop Video Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleVideoFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => videoFileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-orange-500/70 rounded-xl p-5 text-center bg-neutral-900/60 hover:bg-neutral-900 transition-all cursor-pointer group"
              >
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleVideoFileUpload(e.target.files[0]);
                    }
                  }}
                />

                {isUploadingVideo ? (
                  <div className="space-y-2">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
                    <span className="text-xs text-neutral-300">
                      Uploading video file to Firebase Cloud Storage ({videoUploadProgress || 0}%)...
                    </span>
                    <div className="w-48 h-1.5 bg-neutral-800 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-200"
                        style={{ width: `${videoUploadProgress || 0}%` }}
                      />
                    </div>
                  </div>
                ) : editingVideo.videoUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <Film className="w-6 h-6 text-emerald-400" />
                    <div className="text-left text-xs">
                      <span className="font-semibold text-white block">Video source ready</span>
                      <span className="text-neutral-400 text-[11px] truncate max-w-sm block font-mono">
                        {editingVideo.videoUrl}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="w-6 h-6 text-neutral-500 group-hover:text-orange-400 mx-auto transition-colors" />
                    <span className="text-xs font-medium text-neutral-300 block">
                      Drag and drop video file here (MP4 / WebM)
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      Max 250MB • Will auto-extract thumbnail frame
                    </span>
                  </div>
                )}
              </div>

              {/* Or Direct Video / Drive Stream URL */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 shrink-0">Or video / Drive URL:</span>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/... or https://...mp4"
                  value={editingVideo.videoUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Step 2: Thumbnail Management & Studio */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300">
                  2. Video Poster Thumbnail
                </label>
                {editingVideo.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setIsThumbnailStudioOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-medium transition-colors cursor-pointer border border-orange-500/30"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Open Thumbnail Studio</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                <div className="w-20 h-14 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-700 relative">
                  {editingVideo.thumbnailUrl ? (
                    <img
                      src={editingVideo.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={thumbFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleThumbnailUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => thumbFileInputRef.current?.click()}
                      disabled={isUploadingThumb}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {isUploadingThumb ? 'Uploading...' : 'Upload Custom Image'}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter image URL..."
                    value={editingVideo.thumbnailUrl || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                    className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Tokyo Neon Streets"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Category</label>
                <select
                  value={editingVideo.category || 'Cinematic Reels'}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {VIDEO_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Duration (e.g. 0:45)</label>
                <input
                  type="text"
                  placeholder="0:45"
                  value={editingVideo.duration || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Aspect Ratio</label>
                <select
                  value={editingVideo.aspectRatioClass || 'aspect-[9/16]'}
                  onChange={(e) => setEditingVideo({ ...editingVideo, aspectRatioClass: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="aspect-[9/16]">9:16 Portrait Reel (Instagram / TikTok)</option>
                  <option value="aspect-[16/9]">16:9 Landscape Cinematic</option>
                  <option value="aspect-[4/3]">4:3 Classic TV</option>
                  <option value="aspect-square">1:1 Square</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-neutral-300">Caption</label>
                <input
                  type="text"
                  placeholder="Atmospheric night walkthrough in Shinjuku..."
                  value={editingVideo.caption || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Location</label>
                <input
                  type="text"
                  placeholder="Tokyo, Japan"
                  value={editingVideo.location || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, location: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Camera & Gear</label>
                <input
                  type="text"
                  placeholder="Sony A7S III • 35mm T1.5"
                  value={editingVideo.camera || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, camera: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

            </div>

            {/* Publication & Featured Checkboxes */}
            <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingVideo.published !== false}
                  onChange={(e) => setEditingVideo({ ...editingVideo, published: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Publish to Live Videography Gallery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingVideo.featured)}
                  onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-0 bg-neutral-900 border-neutral-700"
                />
                <span>Featured in Cinematic CoverFlow Deck</span>
              </label>
            </div>

            {/* Actions */}
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
                onClick={handleSaveVideo}
                disabled={isUploadingVideo || isUploadingThumb}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Save & Update Gallery
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded Thumbnail Studio Modal reusing VideoThumbnailEditor */}
      {isThumbnailStudioOpen && editingVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl overflow-y-auto"
          onClick={() => setIsThumbnailStudioOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoThumbnailEditor
              videoSrc={editingVideo.videoUrl}
              initialThumbnail={editingVideo.thumbnailUrl}
              onDone={handleSaveThumbnailFromStudio}
              onBack={() => setIsThumbnailStudioOpen(false)}
              mode="modal"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
              <h3 className="text-sm font-bold text-white">Delete Video Reel?</h3>
              <p className="text-xs text-neutral-400">
                This will permanently remove this video reel and its associated storage assets from your portfolio.
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
