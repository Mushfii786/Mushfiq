import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Settings, Save, Check, Globe, Shield, User, Mail, MapPin } from 'lucide-react';

export function SiteSettingsModule() {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const [formData, setFormData] = useState({ ...siteSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Site Configuration & Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            General website preferences, SEO metadata, contact info, and admin controls.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Profile Details */}
        <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Identity & Headline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Display Name</label>
              <input
                type="text"
                value={formData.siteTitle || ''}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Availability Status</label>
            <input
              type="text"
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">About Intro Paragraph</label>
            <textarea
              rows={3}
              value={formData.aboutIntro || ''}
              onChange={(e) => setFormData({ ...formData, aboutIntro: e.target.value })}
              className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">About Bio & Academic Path</label>
            <textarea
              rows={3}
              value={formData.aboutBio || ''}
              onChange={(e) => setFormData({ ...formData, aboutBio: e.target.value })}
              className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Contact & Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Primary Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Public Admin Button Controls */}
        <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Admin Access Controls</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#202126] border border-[#2C2E34]">
            <div>
              <span className="font-semibold text-white block">Floating Admin Button</span>
              <span className="text-[11px] text-[#A1A1AA]">
                Display discreet floating button in bottom-left corner of the public website.
              </span>
            </div>

            <input
              type="checkbox"
              checked={formData.showAdminButton ?? true}
              onChange={(e) => setFormData({ ...formData, showAdminButton: e.target.checked })}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Admin Button Label</label>
            <input
              type="text"
              value={formData.adminButtonLabel || 'Admin'}
              onChange={(e) => setFormData({ ...formData, adminButtonLabel: e.target.value })}
              className="w-48 p-2 rounded bg-[#111214] border border-[#2C2E34] text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

      </form>

    </div>
  );
}
