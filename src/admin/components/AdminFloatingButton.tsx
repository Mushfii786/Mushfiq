import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Shield, Sparkles, SlidersHorizontal, Lock, CheckCircle2 } from 'lucide-react';

interface AdminFloatingButtonProps {
  onOpenLoginModal: () => void;
}

export function AdminFloatingButton({ onOpenLoginModal }: AdminFloatingButtonProps) {
  const { 
    isAdminAuthenticated, 
    isStudioOpen, 
    setIsStudioOpen, 
    siteSettings 
  } = useAdmin();

  const [isHovered, setIsHovered] = useState(false);

  // If hidden via site settings, don't render on public site
  if (!siteSettings.showAdminButton && !isAdminAuthenticated) {
    return null;
  }

  // If studio is already open, button is not needed
  if (isStudioOpen) {
    return null;
  }

  const handleClick = () => {
    if (isAdminAuthenticated) {
      setIsStudioOpen(true);
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 select-none">
      <div className="relative group">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#17181B]/90 hover:bg-[#202126] text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#2C2E34] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer active:scale-95 group"
          aria-label="Portfolio Admin Studio"
        >
          <div className="relative flex items-center justify-center">
            {isAdminAuthenticated ? (
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform duration-200" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-400 transition-colors" />
            )}
            {isAdminAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            )}
          </div>
          
          <span className="text-xs font-mono font-medium tracking-wide">
            {siteSettings.adminButtonLabel || 'Admin'}
          </span>
        </button>

        {/* Minimal Tooltip */}
        <div className={`absolute bottom-full left-0 mb-2 px-2.5 py-1 rounded bg-[#111214] text-[#A1A1AA] text-[11px] font-sans border border-[#2C2E34] whitespace-nowrap shadow-xl transition-all duration-150 pointer-events-none ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}>
          {isAdminAuthenticated ? 'Open Studio Dashboard (Alt+A)' : 'Admin Sign In'}
        </div>
      </div>
    </div>
  );
}
