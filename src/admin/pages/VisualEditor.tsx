import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  RotateCw,
  Save,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Sliders,
  Type,
  Palette,
  Sparkles,
  User,
  Share2,
  Mail,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Upload,
  Loader2
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { FirestoreSiteContent, FirestoreSiteSettings } from '../../types/admin';
import { uploadMediaToStorage } from '../../services/mediaService';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function VisualEditor() {
  const { siteContent, settings, updateSiteContentSection, updateSettings } = useSiteContent();

  // Local draft state for real-time visual editing
  const [contentDraft, setContentDraft] = useState<FirestoreSiteContent>(siteContent);
  const [settingsDraft, setSettingsDraft] = useState<FirestoreSiteSettings>(settings);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<{ content: FirestoreSiteContent; settings: FirestoreSiteSettings }[]>([]);
  const [future, setFuture] = useState<{ content: FirestoreSiteContent; settings: FirestoreSiteSettings }[]>([]);

  // Editor states
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'socials' | 'contact' | 'branding'>('hero');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when server content initially loads or external update occurs
  useEffect(() => {
    setContentDraft(siteContent);
    setSettingsDraft(settings);
  }, [siteContent, settings]);

  // Helper to push state before a change for Undo
  const recordHistory = () => {
    setHistory((prev) => [...prev.slice(-20), { content: contentDraft, settings: settingsDraft }]);
    setFuture([]);
    setSaveStatus('unsaved');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [{ content: contentDraft, settings: settingsDraft }, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setContentDraft(previous.content);
    setSettingsDraft(previous.settings);
    setSaveStatus('unsaved');
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, { content: contentDraft, settings: settingsDraft }]);
    setFuture((prev) => prev.slice(1));
    setContentDraft(next.content);
    setSettingsDraft(next.settings);
    setSaveStatus('unsaved');
  };

  // Avatar upload handler
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploadingAvatar(true);
    try {
      const res = await uploadMediaToStorage(file, 'avatars');
      recordHistory();
      setContentDraft((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          avatarUrl: res.url,
          avatarStoragePath: res.storagePath,
        },
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Save changes to Firestore
  const handlePublish = async () => {
    setSaveStatus('saving');
    try {
      await updateSiteContentSection(contentDraft);
      await updateSettings(settingsDraft);
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Visual Editor Dedicated Top Toolbar */}
      <div className="p-3.5 rounded-2xl bg-[#12151b] border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Left: Page Title & Save Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Visual Website Customizer
            </span>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 ${
              saveStatus === 'saved'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : saveStatus === 'saving'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : saveStatus === 'unsaved'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saved'
                  ? 'bg-emerald-400'
                  : saveStatus === 'saving'
                  ? 'bg-blue-400 animate-ping'
                  : saveStatus === 'unsaved'
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              }`}
            />
            <span>
              {saveStatus === 'saved'
                ? 'All Changes Saved'
                : saveStatus === 'saving'
                ? 'Publishing to Live Site...'
                : saveStatus === 'unsaved'
                ? 'Unsaved Draft'
                : 'Failed to Save'}
            </span>
          </span>
        </div>

        {/* Middle: Undo / Redo & Viewport Switchers */}
        <div className="flex items-center gap-4">
          
          {/* Real Undo & Redo */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              title="Undo change"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={future.length === 0}
              title="Redo change"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Viewport Selectors */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Desktop Viewport (100%)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === 'desktop' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              title="Tablet Viewport (768px)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === 'tablet' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Mobile Viewport (375px)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === 'mobile' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right: Save & Publish Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePublish}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish to Live Site</span>
          </button>
        </div>

      </div>

      {/* Editor Split Layout: Form Controls on Left, Live Rendered Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Panels (5 cols) */}
        <div className="lg:col-span-5 bg-[#12151b] border border-neutral-800/80 rounded-2xl p-5 space-y-5 shadow-md">
          
          {/* Section Selector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-neutral-800/80">
            {[
              { id: 'hero', label: 'Hero', icon: Sparkles },
              { id: 'about', label: 'About', icon: User },
              { id: 'socials', label: 'Socials', icon: Share2 },
              { id: 'contact', label: 'Contact', icon: Mail },
              { id: 'branding', label: 'Branding', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-neutral-800 text-orange-400 font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Availability Badge Text</label>
                <input
                  type="text"
                  value={contentDraft.hero?.availabilityBadge || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      hero: { ...contentDraft.hero, availabilityBadge: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Headline Line 1</label>
                <input
                  type="text"
                  value={contentDraft.hero?.headingPart1 || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      hero: { ...contentDraft.hero, headingPart1: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Headline Line 2</label>
                <input
                  type="text"
                  value={contentDraft.hero?.headingPart2 || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      hero: { ...contentDraft.hero, headingPart2: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Gradient Accent Heading</label>
                <input
                  type="text"
                  value={contentDraft.hero?.gradientHeading || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      hero: { ...contentDraft.hero, gradientHeading: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Hero Subtitle Introduction</label>
                <textarea
                  rows={3}
                  value={contentDraft.hero?.intro || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      hero: { ...contentDraft.hero, intro: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">CTA Button Label</label>
                  <input
                    type="text"
                    value={contentDraft.hero?.ctaLabel || ''}
                    onChange={(e) => {
                      recordHistory();
                      setContentDraft({
                        ...contentDraft,
                        hero: { ...contentDraft.hero, ctaLabel: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">CTA Link Target</label>
                  <input
                    type="text"
                    value={contentDraft.hero?.ctaLink || ''}
                    onChange={(e) => {
                      recordHistory();
                      setContentDraft({
                        ...contentDraft,
                        hero: { ...contentDraft.hero, ctaLink: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              
              {/* Profile Avatar Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Profile Photo (About Section)</label>
                <div className="flex items-center gap-3 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <img
                    src={contentDraft.about?.avatarUrl || ''}
                    alt="Mushfiq"
                    className="w-14 h-14 rounded-full object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAvatarUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                    >
                      {isUploadingAvatar ? 'Uploading...' : 'Upload New Photo'}
                    </button>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      Stored in Cloud Storage
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Introduction Paragraph</label>
                <textarea
                  rows={3}
                  value={contentDraft.about?.intro || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      about: { ...contentDraft.about, intro: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Full Biography & Academic Background</label>
                <textarea
                  rows={4}
                  value={contentDraft.about?.bio || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      about: { ...contentDraft.about, bio: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Location</label>
                  <input
                    type="text"
                    value={contentDraft.about?.location || ''}
                    onChange={(e) => {
                      recordHistory();
                      setContentDraft({
                        ...contentDraft,
                        about: { ...contentDraft.about, location: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Availability Status</label>
                  <input
                    type="text"
                    value={contentDraft.about?.status || ''}
                    onChange={(e) => {
                      recordHistory();
                      setContentDraft({
                        ...contentDraft,
                        about: { ...contentDraft.about, status: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA LINKS */}
          {activeTab === 'socials' && (
            <div className="space-y-3">
              {[
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'github', label: 'GitHub URL' },
                { key: 'linkedin', label: 'LinkedIn URL' },
                { key: 'whatsapp', label: 'WhatsApp Link (wa.me/...)' },
                { key: 'pinterest', label: 'Pinterest Link' },
                { key: 'behance', label: 'Behance Portfolio' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">{label}</label>
                  <input
                    type="text"
                    value={(contentDraft.socials as any)?.[key] || ''}
                    onChange={(e) => {
                      recordHistory();
                      setContentDraft({
                        ...contentDraft,
                        socials: { ...contentDraft.socials, [key]: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CONTACT SECTION */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Contact Section Heading</label>
                <input
                  type="text"
                  value={contentDraft.contact?.heading || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      contact: { ...contentDraft.contact, heading: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Direct Email</label>
                <input
                  type="email"
                  value={contentDraft.contact?.email || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      contact: { ...contentDraft.contact, email: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={contentDraft.contact?.phone || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      contact: { ...contentDraft.contact, phone: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Google Script Webhook URL</label>
                <input
                  type="text"
                  value={contentDraft.contact?.webhookUrl || ''}
                  onChange={(e) => {
                    recordHistory();
                    setContentDraft({
                      ...contentDraft,
                      contact: { ...contentDraft.contact, webhookUrl: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: BRANDING & SITE SETTINGS */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Site Title (Browser Tab)</label>
                <input
                  type="text"
                  value={settingsDraft.siteTitle || ''}
                  onChange={(e) => {
                    recordHistory();
                    setSettingsDraft({ ...settingsDraft, siteTitle: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Brand Name</label>
                <input
                  type="text"
                  value={settingsDraft.siteName || ''}
                  onChange={(e) => {
                    recordHistory();
                    setSettingsDraft({ ...settingsDraft, siteName: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Social Handle</label>
                <input
                  type="text"
                  value={settingsDraft.handle || ''}
                  onChange={(e) => {
                    recordHistory();
                    setSettingsDraft({ ...settingsDraft, handle: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={settingsDraft.metaDescription || ''}
                  onChange={(e) => {
                    recordHistory();
                    setSettingsDraft({ ...settingsDraft, metaDescription: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white resize-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Live Preview Surface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full mb-2 flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="font-mono text-[11px]">Real-Time Viewport Simulation</span>
            <span className="font-mono text-[11px] text-orange-400">
              {viewport === 'desktop' ? '100% Full Width' : viewport === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
            </span>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl bg-neutral-950 ${
              viewport === 'desktop'
                ? 'w-full'
                : viewport === 'tablet'
                ? 'w-[768px] max-w-full'
                : 'w-[375px] max-w-full'
            }`}
          >
            {/* Mock Browser Shell Bar */}
            <div className="h-8 bg-neutral-900 border-b border-neutral-800 px-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 text-center font-mono text-[10px] text-neutral-400 truncate">
                https://mushfii.com
              </div>
            </div>

            {/* Simulated Live Portfolio Hero Section */}
            <div className="p-6 sm:p-10 space-y-6 text-center bg-[#050505] min-h-[480px] flex flex-col items-center justify-center relative overflow-hidden select-none">
              
              {/* Availability Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-[10px] font-mono text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{contentDraft.hero?.availabilityBadge || 'Available for Freelance Projects'}</span>
              </div>

              {/* Headings */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {contentDraft.hero?.headingPart1 || 'Crafting Unforgettable'}
                </h2>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {contentDraft.hero?.headingPart2 || 'Visuals Through'}
                </h2>
                <h3 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {contentDraft.hero?.gradientHeading || 'Photography, Videography & Editing'}
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                {contentDraft.hero?.intro}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold shadow-lg">
                  <span>{contentDraft.hero?.ctaLabel || 'Explore Works'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* About Sneak Peek */}
              <div className="mt-8 pt-6 border-t border-neutral-900 w-full flex items-center justify-center gap-4 text-left">
                <img
                  src={contentDraft.about?.avatarUrl || ''}
                  alt="Mushfiq"
                  className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">{settingsDraft.siteName || 'Mushfiq'}</span>
                  <span className="text-[11px] text-neutral-400 block">{contentDraft.about?.status}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
