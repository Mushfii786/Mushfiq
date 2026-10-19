import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { EDITABLE_ELEMENTS, getElementConfig } from '../elementRegistry';
import { ViewportMode, StyleOverride } from '../types';
import { 
  Undo2, 
  Redo2, 
  Check, 
  Eye, 
  EyeOff, 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Layers, 
  Plus, 
  Image as ImageIcon, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  RotateCcw, 
  Type, 
  Paintbrush, 
  Sliders, 
  Box, 
  Layout, 
  Maximize2, 
  Code,
  MousePointer,
  ExternalLink,
  Lock,
  Trash2,
  Copy
} from 'lucide-react';

interface VisualEditorModuleProps {
  children?: React.ReactNode;
}

export function VisualEditorModule({ children }: VisualEditorModuleProps) {
  const {
    selectedElementId,
    setSelectedElementId,
    hoveredElementId,
    setHoveredElementId,
    viewportMode,
    setViewportMode,
    zoomLevel,
    setZoomLevel,
    isPreviewMode,
    setIsPreviewMode,
    overrides,
    updateElementOverride,
    resetElementOverride,
    getEffectiveOverride,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    saveDraft,
    publishChanges,
  } = useAdmin();

  // Left panel active tab: 'layers' | 'pages' | 'add' | 'assets'
  const [leftTab, setLeftTab] = useState<'layers' | 'pages' | 'add' | 'assets'>('layers');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Hero: true,
    About: true,
    Projects: true,
    Videography: false,
    Contact: false,
    Footer: false,
  });

  // Properties inspector collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    typography: true,
    appearance: true,
    spacing: false,
    layout: false,
    borders: false,
    advanced: false,
  });

  const [linkSpacing, setLinkSpacing] = useState(true);

  const selectedConfig = selectedElementId ? getElementConfig(selectedElementId) : null;
  const currentOverride = selectedElementId ? getEffectiveOverride(selectedElementId) || {} : {};

  const toggleInspectorSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLayerSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Group elements by section for Layers panel
  const sectionsList = ['Hero', 'About', 'Projects', 'Videography', 'Contact', 'Footer'];

  // Viewport width calculation
  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'w-[375px] max-w-[375px]';
      case 'tablet':
        return 'w-[768px] max-w-[768px]';
      case 'laptop':
        return 'w-[1024px] max-w-[1024px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1400px]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111214] text-[#F4F4F5] overflow-hidden select-none">
      
      {/* Top Editor Toolbar */}
      <header className="h-14 bg-[#17181B] border-b border-[#2C2E34] px-4 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Section / Element Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#A1A1AA]">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#71717A]" />
          <span className="text-[#F4F4F5] font-semibold">
            {selectedConfig ? selectedConfig.section : 'Canvas'}
          </span>
          {selectedConfig && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#71717A]" />
              <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {selectedConfig.label}
              </span>
            </>
          )}
        </div>

        {/* Center: Viewport Controls & Preview Toggle */}
        <div className="flex items-center gap-1.5 bg-[#202126] p-1 rounded-lg border border-[#2C2E34]">
          <button
            onClick={() => setViewportMode('desktop')}
            title="Desktop View (1400px)"
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewportMode === 'desktop' ? 'bg-[#17181B] text-white shadow-sm' : 'text-[#71717A] hover:text-[#F4F4F5]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('laptop')}
            title="Laptop View (1024px)"
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewportMode === 'laptop' ? 'bg-[#17181B] text-white shadow-sm' : 'text-[#71717A] hover:text-[#F4F4F5]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewportMode === 'tablet' ? 'bg-[#17181B] text-white shadow-sm' : 'text-[#71717A] hover:text-[#F4F4F5]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            title="Mobile View (375px)"
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewportMode === 'mobile' ? 'bg-[#17181B] text-white shadow-sm' : 'text-[#71717A] hover:text-[#F4F4F5]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#2C2E34] mx-1" />

          {/* Interact / Design Mode Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-sans transition-all cursor-pointer ${
              isPreviewMode 
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
            title={isPreviewMode ? 'Switch to Edit mode' : 'Switch to Preview mode to test links/interactivity'}
          >
            <MousePointer className="w-3 h-3" />
            <span>{isPreviewMode ? 'Previewing' : 'Design'}</span>
          </button>
        </div>

        {/* Right: Undo, Redo, Save Status & Publish */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#A1A1AA]">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded hover:bg-[#202126] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded hover:bg-[#202126] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
            {saveStatus === 'saving' ? (
              <span className="text-yellow-400">Saving...</span>
            ) : saveStatus === 'unsaved' ? (
              <span className="text-neutral-400 cursor-pointer hover:underline" onClick={saveDraft}>
                Unsaved Draft
              </span>
            ) : saveStatus === 'published' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Published
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#71717A]">
                <Check className="w-3 h-3 text-emerald-500" /> Saved
              </span>
            )}
          </div>

          {/* High Contrast White Publish Button per image.png */}
          <button
            onClick={publishChanges}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#F4F4F5] hover:bg-white text-[#111214] text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: Left Panels + Center Live Canvas + Right Properties Inspector */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Panel (240px) */}
        <aside className="w-60 bg-[#17181B] border-r border-[#2C2E34] flex flex-col shrink-0 z-20">
          {/* Panel Tabs */}
          <div className="flex border-b border-[#2C2E34] text-xs font-mono">
            <button
              onClick={() => setLeftTab('layers')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                leftTab === 'layers' 
                  ? 'border-purple-500 text-[#F4F4F5] font-semibold bg-[#202126]/50' 
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => setLeftTab('add')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                leftTab === 'add' 
                  ? 'border-purple-500 text-[#F4F4F5] font-semibold bg-[#202126]/50' 
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setLeftTab('pages')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                leftTab === 'pages' 
                  ? 'border-purple-500 text-[#F4F4F5] font-semibold bg-[#202126]/50' 
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Pages
            </button>
            <button
              onClick={() => setLeftTab('assets')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                leftTab === 'assets' 
                  ? 'border-purple-500 text-[#F4F4F5] font-semibold bg-[#202126]/50' 
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Assets
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
            {leftTab === 'layers' && (
              <div className="space-y-1">
                {sectionsList.map((sec) => {
                  const sectionElements = EDITABLE_ELEMENTS.filter((el) => el.section === sec);
                  const isExpanded = expandedSections[sec];

                  return (
                    <div key={sec} className="rounded border border-[#2C2E34]/50 overflow-hidden">
                      <button
                        onClick={() => toggleLayerSection(sec)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#202126]/60 hover:bg-[#202126] text-[#A1A1AA] hover:text-[#F4F4F5] text-left transition-colors cursor-pointer"
                      >
                        <span className="font-semibold">{sec} Section</span>
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="p-1 space-y-0.5 bg-[#17181B]">
                          {sectionElements.map((el) => {
                            const isSelected = selectedElementId === el.id;
                            const isOverridden = overrides[el.id] && Object.keys(overrides[el.id]).length > 0;

                            return (
                              <div
                                key={el.id}
                                onClick={() => setSelectedElementId(el.id)}
                                onMouseEnter={() => setHoveredElementId(el.id)}
                                onMouseLeave={() => setHoveredElementId(null)}
                                className={`flex items-center justify-between px-2 py-1.5 rounded transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-purple-600 text-white font-medium shadow-sm' 
                                    : 'text-[#A1A1AA] hover:bg-[#202126] hover:text-[#F4F4F5]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="text-[10px] uppercase font-mono opacity-70">
                                    {el.type}
                                  </span>
                                  <span className="truncate">{el.label}</span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {isOverridden && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Custom styles applied" />
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isHidden = overrides[el.id]?.hidden;
                                      updateElementOverride(el.id, { hidden: !isHidden });
                                    }}
                                    className="p-0.5 text-neutral-500 hover:text-white"
                                  >
                                    {overrides[el.id]?.hidden ? (
                                      <EyeOff className="w-3 h-3 text-red-400" />
                                    ) : (
                                      <Eye className="w-3 h-3 opacity-60" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {leftTab === 'add' && (
              <div className="space-y-3 p-1">
                <div className="text-[11px] font-mono text-[#71717A] uppercase">Supported Elements</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Container', icon: Box, type: 'container' },
                    { label: 'Heading', icon: Type, type: 'heading' },
                    { label: 'Text Block', icon: FileText, type: 'paragraph' },
                    { label: 'Button', icon: MousePointer, type: 'button' },
                    { label: 'Image', icon: ImageIcon, type: 'image' },
                    { label: 'Grid', icon: Layout, type: 'grid' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={() => {
                        // Quick add custom override or scroll to matching element
                        const firstMatch = EDITABLE_ELEMENTS.find((e) => e.type === item.type);
                        if (firstMatch) setSelectedElementId(firstMatch.id);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#202126] hover:bg-[#282930] border border-[#2C2E34] text-[#A1A1AA] hover:text-[#F4F4F5] transition-all cursor-pointer group"
                    >
                      <item.icon className="w-4 h-4 mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px]">{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#71717A] leading-relaxed">
                  Click any block to inspect existing sections or customize their typography, layout, spacing and colors.
                </p>
              </div>
            )}

            {leftTab === 'pages' && (
              <div className="space-y-1">
                {[
                  { name: 'Home / Hero', hash: '#home' },
                  { name: 'About & Bio', hash: '#about' },
                  { name: 'Selected Works', hash: '#projects' },
                  { name: 'Videography', hash: '#projects' },
                  { name: 'Contact', hash: '#contact' },
                ].map((pg) => (
                  <a
                    key={pg.name}
                    href={pg.hash}
                    className="flex items-center justify-between px-3 py-2 rounded bg-[#202126]/60 hover:bg-[#202126] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                  >
                    <span>{pg.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ))}
              </div>
            )}

            {leftTab === 'assets' && (
              <div className="space-y-2 p-1">
                <div className="text-[11px] font-mono text-[#71717A] uppercase">Media Quick Insert</div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-[#202126] border border-[#2C2E34]">
                    <span className="text-[10px] text-[#71717A] font-mono block mb-1">Mushfiq Avatar</span>
                    <img 
                      src="/src/assets/images/Mushfii.jpg" 
                      alt="Avatar" 
                      className="w-full h-20 object-cover rounded mb-1.5"
                    />
                    <button
                      onClick={() => {
                        if (selectedElementId) {
                          updateElementOverride(selectedElementId, { src: '/src/assets/images/Mushfii.jpg' });
                        }
                      }}
                      className="w-full py-1 text-center bg-[#17181B] hover:bg-purple-600 text-white rounded text-[11px] transition-colors"
                    >
                      Apply To Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Live Canvas Area */}
        <main className="flex-1 bg-[#0d0e10] flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 relative">
          
          {/* Canvas Viewport Frame */}
          <div className="w-full flex flex-col items-center">
            
            {/* Viewport Header Bar per image.png */}
            <div className={`flex items-center justify-between px-3 py-1.5 mb-2 bg-[#17181B] border border-[#2C2E34] rounded-t-lg text-xs font-mono text-[#A1A1AA] ${getViewportWidthClass()}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-white">LIVE CANVAS</span>
              </div>
              <span className="text-[11px] text-[#71717A]">
                {viewportMode.toUpperCase()} PREVIEW ({viewportMode === 'mobile' ? '375px' : viewportMode === 'tablet' ? '768px' : viewportMode === 'laptop' ? '1024px' : '100%'})
              </span>
            </div>

            {/* Live Portfolio Preview Viewport */}
            <div
              className={`bg-[#050505] rounded-b-lg border border-[#2C2E34] shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ${getViewportWidthClass()}`}
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              {children}
            </div>

          </div>
        </main>

        {/* Right Properties Inspector (300px) */}
        <aside className="w-[310px] bg-[#17181B] border-l border-[#2C2E34] flex flex-col shrink-0 z-20 overflow-y-auto">
          
          {/* Header */}
          <div className="h-11 px-4 border-b border-[#2C2E34] flex items-center justify-between shrink-0">
            <span className="text-xs font-mono font-bold tracking-wider text-[#F4F4F5] uppercase">
              PROPERTIES
            </span>
            {selectedElementId && (
              <button
                onClick={() => resetElementOverride(selectedElementId)}
                title="Reset all element styles"
                className="flex items-center gap-1 text-[11px] font-mono text-[#71717A] hover:text-purple-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {selectedElementId && selectedConfig ? (
            <div className="p-4 space-y-4">
              
              {/* Selected Element Identity Box */}
              <div className="p-2.5 rounded-lg bg-[#202126] border border-[#2C2E34]">
                <div className="text-[10px] font-mono uppercase text-[#71717A]">
                  Selected {selectedConfig.type}
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {selectedConfig.label}
                </div>
                <div className="text-[11px] font-mono text-purple-400 truncate">
                  ID: {selectedConfig.id}
                </div>
              </div>

              {/* 1. Content & Text */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('content')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Content
                  </span>
                  {openSections.content ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.content && (
                  <div className="p-3 space-y-3 bg-[#17181B] text-xs">
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                        Displayed Text
                      </label>
                      <textarea
                        rows={3}
                        value={currentOverride.text ?? selectedConfig.defaultText ?? ''}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { text: e.target.value })}
                        placeholder="Type text content here..."
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {selectedConfig.type === 'button' && (
                      <div>
                        <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                          Button Destination URL
                        </label>
                        <input
                          type="text"
                          value={currentOverride.href || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { href: e.target.value })}
                          placeholder="e.g. #projects or https://..."
                          className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Typography per image.png */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('typography')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    Typography
                  </span>
                  {openSections.typography ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.typography && (
                  <div className="p-3 space-y-3 bg-[#17181B] text-xs">
                    
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-[#A1A1AA] font-mono">Font size</label>
                        <span className="text-[10px] text-purple-400 font-mono">
                          {currentOverride.fontSize || selectedConfig.defaultStyles?.fontSize || 'inherit'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={currentOverride.fontSize || selectedConfig.defaultStyles?.fontSize || ''}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { fontSize: e.target.value })}
                        placeholder="e.g. 48px or 2.5rem"
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Font Weight */}
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                        Font weight
                      </label>
                      <select
                        value={currentOverride.fontWeight || selectedConfig.defaultStyles?.fontWeight || '400'}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { fontWeight: e.target.value })}
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="300">300 - Light</option>
                        <option value="400">400 - Regular</option>
                        <option value="500">500 - Medium</option>
                        <option value="600">600 - SemiBold</option>
                        <option value="700">700 - Bold</option>
                        <option value="800">800 - ExtraBold</option>
                        <option value="900">900 - Black</option>
                      </select>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                        Text color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentOverride.color || '#FFFFFF'}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { color: e.target.value })}
                          className="w-8 h-8 rounded border border-[#2C2E34] cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={currentOverride.color || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { color: e.target.value })}
                          placeholder="#FFFFFF"
                          className="flex-1 p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs font-mono uppercase focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                        Text alignment
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateElementOverride(selectedConfig.id, { textAlign: align })}
                            className={`py-1.5 text-center rounded capitalize text-[11px] transition-colors cursor-pointer ${
                              currentOverride.textAlign === align 
                                ? 'bg-purple-600 text-white font-semibold' 
                                : 'bg-[#202126] text-[#A1A1AA] hover:text-white'
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Line Height & Letter Spacing */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#A1A1AA] font-mono mb-1">Line Height</label>
                        <input
                          type="text"
                          value={currentOverride.lineHeight || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { lineHeight: e.target.value })}
                          placeholder="e.g. 1.2"
                          className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#A1A1AA] font-mono mb-1">Letter Spacing</label>
                        <input
                          type="text"
                          value={currentOverride.letterSpacing || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { letterSpacing: e.target.value })}
                          placeholder="e.g. -0.02em"
                          className="w-full p-1.5 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* 3. Appearance */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('appearance')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <Paintbrush className="w-3.5 h-3.5 text-purple-400" />
                    Appearance
                  </span>
                  {openSections.appearance ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.appearance && (
                  <div className="p-3 space-y-3 bg-[#17181B] text-xs">
                    {/* Background Color */}
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentOverride.backgroundColor || '#050505'}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded border border-[#2C2E34] cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={currentOverride.backgroundColor || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { backgroundColor: e.target.value })}
                          placeholder="e.g. #050505 or rgba(...)"
                          className="flex-1 p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Opacity */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-[#A1A1AA] font-mono">Opacity</label>
                        <span className="text-[10px] text-purple-400 font-mono">
                          {currentOverride.opacity !== undefined ? `${Math.round(currentOverride.opacity * 100)}%` : '100%'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentOverride.opacity !== undefined ? currentOverride.opacity : 1}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { opacity: parseFloat(e.target.value) })}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Spacing */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('spacing')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Spacing
                  </span>
                  {openSections.spacing ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.spacing && (
                  <div className="p-3 space-y-3 bg-[#17181B] text-xs">
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">Padding</label>
                      <input
                        type="text"
                        value={currentOverride.padding || ''}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { padding: e.target.value })}
                        placeholder="e.g. 16px or 12px 24px"
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">Margin</label>
                      <input
                        type="text"
                        value={currentOverride.margin || ''}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { margin: e.target.value })}
                        placeholder="e.g. 0px auto or 20px"
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Borders & Shadows */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('borders')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-purple-400" />
                    Borders & Shadows
                  </span>
                  {openSections.borders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.borders && (
                  <div className="p-3 space-y-3 bg-[#17181B] text-xs">
                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">Corner Radius</label>
                      <input
                        type="text"
                        value={currentOverride.borderRadius || ''}
                        onChange={(e) => updateElementOverride(selectedConfig.id, { borderRadius: e.target.value })}
                        placeholder="e.g. 8px or 9999px"
                        className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A1A1AA] mb-1 font-mono">Border Color & Width</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentOverride.borderWidth || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { borderWidth: e.target.value })}
                          placeholder="1px"
                          className="w-16 p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                        />
                        <input
                          type="text"
                          value={currentOverride.borderColor || ''}
                          onChange={(e) => updateElementOverride(selectedConfig.id, { borderColor: e.target.value })}
                          placeholder="#2C2E34"
                          className="flex-1 p-2 rounded bg-[#111214] border border-[#2C2E34] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Advanced CSS */}
              <div className="border border-[#2C2E34] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleInspectorSection('advanced')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#202126]/60 text-xs font-semibold text-[#F4F4F5] hover:bg-[#202126]"
                >
                  <span className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-purple-400" />
                    Advanced CSS
                  </span>
                  {openSections.advanced ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSections.advanced && (
                  <div className="p-3 space-y-2 bg-[#17181B] text-xs">
                    <label className="block text-[11px] text-[#A1A1AA] font-mono">
                      Custom CSS Rules
                    </label>
                    <textarea
                      rows={3}
                      value={currentOverride.customCss || ''}
                      onChange={(e) => updateElementOverride(selectedConfig.id, { customCss: e.target.value })}
                      placeholder="e.g. filter: drop-shadow(0 0 10px #8B5CF6);"
                      className="w-full p-2 rounded bg-[#111214] border border-[#2C2E34] text-purple-300 font-mono text-[11px]"
                    />
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Empty State: Guide User to Click Canvas Elements */
            <div className="p-6 text-center text-[#71717A] space-y-3 my-auto">
              <div className="w-10 h-10 rounded-full bg-[#202126] border border-[#2C2E34] mx-auto flex items-center justify-center text-purple-400">
                <MousePointer className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F4F4F5]">No Element Selected</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Click any section, heading, button, or container in the Live Canvas or choose one from the Layers panel to adjust its styles and content.
              </p>
            </div>
          )}

        </aside>

      </div>
    </div>
  );
}
