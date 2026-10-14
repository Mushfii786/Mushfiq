import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { AdminModule } from './types';
import { VisualEditorModule } from './components/VisualEditorModule';
import { OverviewModule } from './components/OverviewModule';
import { ProjectsModule } from './components/ProjectsModule';
import { BlogModule } from './components/BlogModule';
import { GalleryModule } from './components/GalleryModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { ContactInboxModule } from './components/ContactInboxModule';
import { DesignSystemModule } from './components/DesignSystemModule';
import { SiteSettingsModule } from './components/SiteSettingsModule';
import { 
  LayoutDashboard, 
  Sliders, 
  Briefcase, 
  BookOpen, 
  Image as ImageIcon, 
  TrendingUp, 
  MessageSquare, 
  Palette, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Layers,
  Sparkles,
  Shield,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface AdminStudioProps {
  children?: React.ReactNode;
}

export function AdminStudio({ children }: AdminStudioProps) {
  const {
    activeModule,
    setActiveModule,
    setIsStudioOpen,
    logout,
    contactMessages,
    siteSettings,
  } = useAdmin();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadMessagesCount = contactMessages.filter((m) => !m.read).length;

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        { id: 'overview' as AdminModule, label: 'Overview', icon: LayoutDashboard },
        { id: 'editor' as AdminModule, label: 'Editor', icon: Sliders },
      ],
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'projects' as AdminModule, label: 'Projects', icon: Briefcase },
        { id: 'blog' as AdminModule, label: 'Blog', icon: BookOpen },
        { id: 'gallery' as AdminModule, label: 'Gallery', icon: ImageIcon },
      ],
    },
    {
      group: 'INSIGHTS',
      items: [
        { id: 'analytics' as AdminModule, label: 'Analytics', icon: TrendingUp },
        { 
          id: 'inbox' as AdminModule, 
          label: 'Contact Inbox', 
          icon: MessageSquare, 
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined 
        },
      ],
    },
    {
      group: 'CONFIGURATION',
      items: [
        { id: 'design-system' as AdminModule, label: 'Design System', icon: Palette },
        { id: 'settings' as AdminModule, label: 'Site Settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-[#111214] text-[#F4F4F5] font-sans antialiased overflow-hidden select-none">
      
      {/* Left Navigation Sidebar */}
      <aside
        className={`bg-[#17181B] border-r border-[#2C2E34] flex flex-col justify-between transition-all duration-300 shrink-0 z-40 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Top Header per image.png */}
        <div className="h-14 border-b border-[#2C2E34] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-md bg-[#202126] border border-[#2C2E34] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-sm tracking-tight text-white truncate">
                Portfolio Studio
              </span>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded text-[#71717A] hover:text-white transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-[#71717A] uppercase">
                  {grp.group}
                </div>
              )}

              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#202126] text-white font-semibold shadow-sm border border-[#2C2E34]'
                          : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#202126]/50'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-[#71717A]'}`} />
                      
                      {!sidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}

                      {!sidebarCollapsed && item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-600 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#2C2E34] space-y-2 shrink-0">
          
          {/* Exit to Public Website Button */}
          <button
            onClick={() => setIsStudioOpen(false)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#202126] hover:bg-[#282930] text-[#A1A1AA] hover:text-white text-xs border border-[#2C2E34] transition-colors cursor-pointer"
            title="View public website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            {!sidebarCollapsed && <span className="truncate font-medium">View Public Site</span>}
          </button>

          {/* Admin Profile & Logout */}
          <div className="flex items-center justify-between pt-1">
            {!sidebarCollapsed ? (
              <div className="truncate mr-2">
                <span className="text-xs font-bold text-white truncate block">Mushfiq</span>
                <span className="text-[10px] font-mono text-emerald-400">Admin Mode</span>
              </div>
            ) : null}

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded hover:bg-[#202126] text-[#71717A] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* Central Working Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#111214]">
        
        {/* If Active Module is Visual Editor, render VisualEditorModule containing the live canvas */}
        {activeModule === 'editor' && (
          <VisualEditorModule>
            {children}
          </VisualEditorModule>
        )}

        {/* Other Admin Modules */}
        {activeModule !== 'editor' && (
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            {/* Top Toolbar for ordinary dashboard pages */}
            <header className="h-14 bg-[#17181B] border-b border-[#2C2E34] px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#A1A1AA]">Studio</span>
                <span className="text-[#71717A]">/</span>
                <span className="text-white font-semibold capitalize">{activeModule.replace('-', ' ')}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsStudioOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202126] hover:bg-[#282930] text-xs font-medium text-[#F4F4F5] border border-[#2C2E34] transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3 text-purple-400" />
                  <span>Exit to Website</span>
                </button>
              </div>
            </header>

            {/* Dynamic Module Content */}
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              {activeModule === 'overview' && <OverviewModule />}
              {activeModule === 'projects' && <ProjectsModule />}
              {activeModule === 'blog' && <BlogModule />}
              {activeModule === 'gallery' && <GalleryModule />}
              {activeModule === 'analytics' && <AnalyticsModule />}
              {activeModule === 'inbox' && <ContactInboxModule />}
              {activeModule === 'design-system' && <DesignSystemModule />}
              {activeModule === 'settings' && <SiteSettingsModule />}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
