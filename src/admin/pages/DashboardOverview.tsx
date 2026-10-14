import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Camera,
  Video,
  Image as ImageIcon,
  Eye,
  Plus,
  ArrowUpRight,
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sliders
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function DashboardOverview() {
  const { photos, videos, projects, isFirebaseActive } = useSiteContent();
  const { user } = useAdminAuth();

  const publishedPhotosCount = photos.filter((p) => p.published).length;
  const draftPhotosCount = photos.length - publishedPhotosCount;

  const publishedVideosCount = videos.filter((v) => v.published).length;
  const draftVideosCount = videos.length - publishedVideosCount;

  const publishedProjectsCount = projects.filter((p) => p.published).length;
  const totalMediaAssets = photos.length + videos.length;

  const statsCards = [
    {
      title: 'Published Projects',
      value: publishedProjectsCount,
      total: projects.length,
      icon: FolderGit2,
      color: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      link: '/admin/projects',
    },
    {
      title: 'Photography Works',
      value: publishedPhotosCount,
      total: photos.length,
      icon: Camera,
      color: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      link: '/admin/photography',
    },
    {
      title: 'Videography Reels',
      value: publishedVideosCount,
      total: videos.length,
      icon: Video,
      color: 'from-orange-500/20 to-orange-600/5',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      link: '/admin/videography',
    },
    {
      title: 'Total Media Assets',
      value: totalMediaAssets,
      total: totalMediaAssets,
      icon: ImageIcon,
      color: 'from-purple-500/20 to-purple-600/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      link: '/admin/media',
    },
  ];

  const recentUploads = [
    ...videos.slice(0, 3).map((v) => ({
      id: v.id,
      title: v.title,
      type: 'Video Reel',
      category: v.category,
      url: v.thumbnailUrl || v.videoUrl,
      status: v.published ? 'Published' : 'Draft',
      editLink: '/admin/videography',
    })),
    ...photos.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      type: 'Photograph',
      category: p.category,
      url: p.url,
      status: p.published ? 'Published' : 'Draft',
      editLink: '/admin/photography',
    })),
  ].slice(0, 5);

  return (
    <div className="space-y-8 select-none">
      
      {/* Welcome & Status Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#171b24] via-[#12151c] to-[#0f1117] border border-neutral-800/80 shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs font-mono text-orange-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.displayName || 'Mushfiq'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              Manage your photography portfolio, cinematic video reels, client projects, and live website presentation in real-time.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/photography"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-950/40 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Photo</span>
            </Link>
            <Link
              to="/admin/videography"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold transition-all hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" />
              <span>Upload Video</span>
            </Link>
            <Link
              to="/admin/editor"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold transition-all hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              <span>Visual Editor</span>
            </Link>
          </div>
        </div>

        {/* Database notice if running on local fallback */}
        {!isFirebaseActive && (
          <div className="mt-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300">
              <span className="font-semibold text-amber-400">Firebase configuration pending: </span>
              Your dashboard is currently running in offline fallback mode with default portfolio records. To enable persistent cross-device uploads, add your <code className="text-amber-300 font-mono">VITE_FIREBASE_*</code> credentials.
              <Link to="/admin/settings" className="underline text-amber-400 ml-1 font-semibold hover:text-amber-300">
                View Setup Guide →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className={`p-5 rounded-2xl bg-gradient-to-b ${card.color} bg-[#12151c] border ${card.borderColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg bg-neutral-900/80 flex items-center justify-center ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {card.value} / {card.total} active
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Recent Uploads & Quick CMS Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Content Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Recent Media & Content</h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">{recentUploads.length} items</span>
          </div>

          <div className="divide-y divide-neutral-800/60">
            {recentUploads.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono truncate">
                      {item.type} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      item.status === 'Published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  <Link
                    to={item.editLink}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts & System Status */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Core Modules</span>
            </h2>

            <div className="space-y-2">
              <Link
                to="/admin/photography"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/70 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Photography Gallery</span>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono group-hover:text-white">
                  {photos.length} photos →
                </span>
              </Link>

              <Link
                to="/admin/videography"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/70 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-orange-400" />
                  <span>Cinematic Videography</span>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono group-hover:text-white">
                  {videos.length} reels →
                </span>
              </Link>

              <Link
                to="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/70 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-blue-400" />
                  <span>Featured Projects</span>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono group-hover:text-white">
                  {projects.length} works →
                </span>
              </Link>

              <Link
                to="/admin/editor"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/70 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>Visual Site Customizer</span>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono group-hover:text-white">
                  Live Preview →
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
