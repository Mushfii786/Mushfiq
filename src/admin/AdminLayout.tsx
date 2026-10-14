import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Eye,
  Camera,
  Video,
  FolderGit2,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Layers,
  Database
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteContent } from '../context/SiteContentContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/editor', label: 'Visual Editor', icon: Eye },
  { path: '/admin/photography', label: 'Photography', icon: Camera },
  { path: '/admin/videography', label: 'Videography', icon: Video },
  { path: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, isLoading, signOut } = useAdminAuth();
  const { isFirebaseActive } = useSiteContent();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsed state saved to localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mushfii_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mushfii_admin_sidebar_collapsed', String(collapsed));
    } catch {}
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isVisualEditorPage = location.pathname === '/admin/editor';

  return (
    <div className="min-h-screen bg-[#0d0f12] text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-orange-500/30 selection:text-orange-200 antialiased overflow-x-hidden">
      
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 flex flex-col bg-[#12151b] border-r border-neutral-800/80 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileDrawerOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/80 select-none">
          <Link
            to="/admin"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/80 flex items-center justify-center shrink-0 shadow-md group-hover:border-orange-500/50 transition-colors">
              <span className="font-mono font-black text-orange-500 text-sm tracking-wider">M</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-white uppercase truncate">
                  MUSHFII CMS
                </span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-wider truncate">
                  Creative Studio
                </span>
              </div>
            )}
          </Link>

          {/* Toggle Collapsed Button (Desktop only) */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Close Mobile Drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
            className="md:hidden w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-neutral-800/90 text-white font-semibold shadow-sm border border-neutral-700/70'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-orange-500 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-orange-500' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-neutral-900 text-white text-[11px] rounded-md shadow-xl border border-neutral-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Database Status Pill */}
        <div className={`p-3 border-t border-neutral-800/80 ${collapsed ? 'text-center' : ''}`}>
          <div
            className={`flex items-center gap-2 p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/60 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                isFirebaseActive ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              }`}
            />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-neutral-300 truncate">
                  {isFirebaseActive ? 'Firebase Connected' : 'Local Fallback'}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono truncate">
                  {isFirebaseActive ? 'Firestore & Storage' : 'Configure .env'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700/80 flex items-center justify-center font-bold text-xs text-orange-400 shrink-0">
              {user.displayName?.charAt(0) || 'M'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {user.displayName || 'Mushfiq'}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono truncate">
                  {user.email || 'Admin'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={signOut}
            title="Sign Out"
            aria-label="Sign Out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Context-Sensitive Top Toolbar */}
        <header className="h-16 px-4 sm:px-6 bg-[#12151b]/80 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Section Name */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-neutral-400 hidden sm:inline">Admin</span>
              <span className="text-neutral-600 hidden sm:inline">/</span>
              <span className="font-semibold text-white capitalize">
                {location.pathname === '/admin'
                  ? 'Dashboard'
                  : location.pathname.split('/')[2]?.replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          {/* Action Toolbar on Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Portfolio Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-sm group"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-orange-400 transition-colors" />
            </a>

            {!isFirebaseActive && (
              <Link
                to="/admin/settings"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <span>Setup Firebase</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
