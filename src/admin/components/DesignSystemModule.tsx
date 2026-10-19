import React from 'react';
import { useAdmin } from '../AdminContext';
import { Palette, Sparkles, Check, Sliders, Box, Type } from 'lucide-react';

export function DesignSystemModule() {
  const { siteSettings, updateSiteSettings } = useAdmin();

  const accentPresets = [
    { name: 'Electric Violet', hex: '#8B5CF6' },
    { name: 'Royal Blue', hex: '#3B82F6' },
    { name: 'Cyan Wave', hex: '#06B6D4' },
    { name: 'Emerald Luxe', hex: '#10B981' },
    { name: 'Rose Quartz', hex: '#F43F5E' },
    { name: 'Amber Gold', hex: '#F59E0B' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Global Design System & Tokens
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Configure overarching branding colors, radii, and typographic hierarchy across the entire portfolio.
        </p>
      </div>

      {/* 1. Primary Accent Color */}
      <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Primary Brand Accent</h3>
        </div>

        <p className="text-xs text-[#A1A1AA]">
          This color accent is applied to active buttons, glow shaders, badges, and link highlights.
        </p>

        {/* Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {accentPresets.map((preset) => {
            const isSelected = siteSettings.primaryAccent?.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                onClick={() => updateSiteSettings({ primaryAccent: preset.hex })}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  isSelected ? 'border-white bg-[#202126]' : 'border-[#2C2E34] bg-[#111214] hover:border-[#3E414A]'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white truncate">{preset.name}</div>
                  <div className="text-[9px] font-mono text-[#71717A] uppercase">{preset.hex}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Input */}
        <div className="pt-2 flex items-center gap-3">
          <label className="text-xs font-mono text-[#A1A1AA]">Custom Accent:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={siteSettings.primaryAccent || '#8B5CF6'}
              onChange={(e) => updateSiteSettings({ primaryAccent: e.target.value })}
              className="w-8 h-8 rounded border border-[#2C2E34] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={siteSettings.primaryAccent || '#8B5CF6'}
              onChange={(e) => updateSiteSettings({ primaryAccent: e.target.value })}
              className="w-28 p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-xs font-mono text-white uppercase"
            />
          </div>
        </div>
      </div>

      {/* 2. Border Radius Token */}
      <div className="p-5 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Corner Radius Discipline</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'sharp', label: 'Sharp (4px)', desc: 'Brutalist & Technical' },
            { id: 'subtle', label: 'Subtle (8px)', desc: 'Standard Modern UI' },
            { id: 'rounded', label: 'Rounded (14px)', desc: 'Friendly & Fluid' },
            { id: 'pill', label: 'Pill (Full)', desc: 'Ultra-organic Capsules' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => updateSiteSettings({ borderRadiusPreset: r.id as any })}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                siteSettings.borderRadiusPreset === r.id
                  ? 'border-purple-500 bg-[#202126] text-white'
                  : 'border-[#2C2E34] bg-[#111214] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{r.label}</div>
              <div className="text-[10px] text-[#71717A] mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="p-6 rounded-xl bg-[#17181B] border border-[#2C2E34] space-y-4">
        <h3 className="text-sm font-semibold text-white">Live Design Token Preview</h3>
        <p className="text-xs text-[#A1A1AA]">
          Preview of button and badge components reacting to your selected design tokens.
        </p>

        <div className="p-6 rounded-xl bg-[#0a0a0a] border border-[#2C2E34] flex flex-wrap items-center gap-4">
          <button
            style={{ backgroundColor: siteSettings.primaryAccent || '#8B5CF6' }}
            className="px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            Explore Projects
          </button>

          <span
            style={{
              borderColor: `${siteSettings.primaryAccent || '#8B5CF6'}40`,
              color: siteSettings.primaryAccent || '#8B5CF6',
              backgroundColor: `${siteSettings.primaryAccent || '#8B5CF6'}15`,
            }}
            className="px-3 py-1 text-xs font-mono border"
          >
            Available for Freelance
          </span>
        </div>
      </div>

    </div>
  );
}
