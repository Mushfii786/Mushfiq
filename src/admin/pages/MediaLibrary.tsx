import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Search,
  Trash2,
  ExternalLink,
  Film,
  Camera,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { deleteMediaFromStorage } from '../../services/mediaService';

export function MediaLibrary() {
  const { photos, videos, isFirebaseActive } = useSiteContent();

  const [filterType, setFilterType] = useState<'all' | 'photos' | 'videos' | 'thumbnails'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Build aggregated media list from photos & videos collections
  const mediaList = [
    ...photos.map((p) => ({
      id: `media-photo-${p.id}`,
      name: p.title || 'Photograph',
      url: p.url,
      storagePath: p.storagePath,
      type: 'photos' as const,
      category: p.category,
      year: p.year,
    })),
    ...videos.map((v) => ({
      id: `media-video-${v.id}`,
      name: v.title || 'Video Reel',
      url: v.videoUrl,
      storagePath: v.videoStoragePath,
      type: 'videos' as const,
      category: v.category,
      year: v.year,
    })),
    ...videos
      .filter((v) => v.thumbnailUrl && v.thumbnailUrl !== v.videoUrl)
      .map((v) => ({
        id: `media-thumb-${v.id}`,
        name: `${v.title} (Poster Thumbnail)`,
        url: v.thumbnailUrl,
        storagePath: v.thumbnailStoragePath,
        type: 'thumbnails' as const,
        category: v.category,
        year: v.year,
      })),
  ];

  const filteredMedia = mediaList.filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.category && m.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Download URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2500);
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
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ImageIcon className="w-6 h-6 text-purple-400" />
          <span>Centralized Media Library</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Browse all persistent media files stored across Firebase Cloud Storage for your portfolio.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All (${mediaList.length})` },
            { id: 'photos', label: `Photos (${photos.length})` },
            { id: 'videos', label: `Videos (${videos.length})` },
            { id: 'thumbnails', label: `Thumbnails (${videos.filter((v) => v.thumbnailUrl).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151b] border border-neutral-800/80 space-y-3">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No media found</h3>
          <p className="text-xs text-neutral-400">
            Upload photographs or video reels to populate the media library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="group rounded-2xl bg-[#12151b] border border-neutral-800/80 hover:border-neutral-700 overflow-hidden flex flex-col shadow-md transition-all duration-200"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-square bg-neutral-950 overflow-hidden">
                {media.type === 'videos' ? (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-400">
                    <Video className="w-8 h-8 text-orange-400" />
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}

                {/* Type Badge */}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 backdrop-blur-md text-neutral-300 uppercase">
                  {media.type}
                </span>

                {/* Copy URL Quick Action */}
                <button
                  type="button"
                  onClick={() => handleCopyUrl(media.url)}
                  title="Copy permanent download URL"
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {copiedUrl === media.url ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Meta details */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white truncate line-clamp-1" title={media.name}>
                    {media.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                    {media.category}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 flex items-center gap-1 font-mono"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
