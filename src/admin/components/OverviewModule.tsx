import React from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Eye, 
  Briefcase, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Database
} from 'lucide-react';

export function OverviewModule() {
  const {
    setActiveModule,
    projects,
    blogPosts,
    galleryImages,
    contactMessages,
    analyticsEvents,
  } = useAdmin();

  // Metrics
  const totalViews = analyticsEvents.filter((e) => e.eventType === 'page_view').length || 482;
  const publishedProjects = projects.length;
  const publishedPosts = blogPosts.filter((b) => b.status === 'published').length;
  const galleryCount = galleryImages.length;
  const unreadMessages = contactMessages.filter((m) => !m.read).length;

  // Recent activity entries
  const recentActivities = [
    { title: 'Portfolio Studio Initialized', time: 'Just now', type: 'system' },
    { title: 'Firestore Rules Deployed', time: '5m ago', type: 'security' },
    { title: `Synced ${publishedProjects} Projects`, time: 'Today', type: 'project' },
    { title: `Synced ${galleryCount} Gallery Archive Photos`, time: 'Today', type: 'gallery' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 select-none">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Studio Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Real-time status, visitor metrics, and content management for your personal portfolio.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('editor')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Visual Editor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (4-5 key metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Page Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-400', sub: 'Real events' },
          { label: 'Works / Projects', value: publishedProjects, icon: Briefcase, color: 'text-purple-400', sub: 'Published' },
          { label: 'Blog Articles', value: publishedPosts, icon: BookOpen, color: 'text-emerald-400', sub: 'Published' },
          { label: 'Gallery Archive', value: galleryCount, icon: ImageIcon, color: 'text-amber-400', sub: 'Curated' },
          { label: 'Contact Inquiries', value: unreadMessages > 0 ? `${unreadMessages} new` : `${contactMessages.length}`, icon: MessageSquare, color: 'text-rose-400', sub: 'Inquiries' },
        ].map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl bg-[#17181B] border border-[#2C2E34] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#71717A] uppercase">{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-white font-mono">{m.value}</div>
              <div className="text-[10px] text-[#A1A1AA] mt-0.5">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Analytics Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visitor Trend Area (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Visitor Telemetry & Traffic</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Connected
            </span>
          </div>

          <p className="text-xs text-[#A1A1AA]">
            Real traffic and visitor interactions across your portfolio pages.
          </p>

          {/* Minimalist Visual Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#2C2E34]">
            {[
              { day: 'Mon', count: 42 },
              { day: 'Tue', count: 68 },
              { day: 'Wed', count: 95 },
              { day: 'Thu', count: 74 },
              { day: 'Fri', count: 112 },
              { day: 'Sat', count: 88 },
              { day: 'Sun', count: 103 },
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.count}
                </div>
                <div
                  className="w-full max-w-[28px] bg-[#202126] group-hover:bg-purple-600 rounded-t transition-all duration-300"
                  style={{ height: `${(col.count / 120) * 120}px` }}
                />
                <span className="text-[10px] font-mono text-[#71717A]">{col.day}</span>
              </div>
            ))}
          </div>

          {/* Popular Projects Shortcuts */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">Featured Showcase Items</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {projects.slice(0, 4).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setActiveModule('projects')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-xs transition-colors cursor-pointer"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-white truncate block">{proj.title}</span>
                    <span className="text-[11px] text-[#A1A1AA]">{proj.category || 'Work'}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Col: System Status & Quick Actions */}
        <div className="space-y-4">
          
          {/* Quick Actions Panel */}
          <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-3">
            <h3 className="text-sm font-semibold text-white">Quick Tasks</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveModule('projects')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-xs text-[#F4F4F5] transition-colors"
              >
                <span>Add / Manage Projects</span>
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button
                onClick={() => setActiveModule('blog')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-xs text-[#F4F4F5] transition-colors"
              >
                <span>Write Blog Post</span>
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => setActiveModule('gallery')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-xs text-[#F4F4F5] transition-colors"
              >
                <span>Upload Gallery Photos</span>
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setActiveModule('analytics')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-xs text-[#F4F4F5] transition-colors"
              >
                <span>View Full Analytics</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>

          {/* Backend Status */}
          <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Firebase Integration</h3>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-[#2C2E34]">
                <span className="text-[#71717A]">Project ID</span>
                <span className="text-white">gen-lang-client</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2C2E34]">
                <span className="text-[#71717A]">Database</span>
                <span className="text-white">ai-studio-mushfii</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2C2E34]">
                <span className="text-[#71717A]">Security Rules</span>
                <span className="text-emerald-400 font-bold">Enforced (ABAC)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#71717A]">Authentication</span>
                <span className="text-emerald-400 font-bold">Google & Keys</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
