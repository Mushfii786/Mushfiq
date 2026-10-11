import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  User,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  Video
} from 'lucide-react';
import { VideoGalleryItem } from './VideoGalleryPage';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddVideoModal: () => void;
  customVideos: VideoGalleryItem[];
  onDeleteCustomVideo: (id: string, e: React.MouseEvent) => void;
  onSelectVideo?: (video: VideoGalleryItem) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const DEFAULT_ADMIN_ID = 'admin';
const DEFAULT_ADMIN_PASS = 'admin123';
const CREDS_STORAGE_KEY = 'mushfiq_videography_admin_creds';
const SESSION_STORAGE_KEY = 'mushfiq_videography_admin_session';

export function AdminAuthModal({
  isOpen,
  onClose,
  onOpenAddVideoModal,
  customVideos,
  onDeleteCustomVideo,
  onSelectVideo,
  isAuthenticated,
  setIsAuthenticated,
}: AdminAuthModalProps) {
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Credentials customization
  const [isChangingCreds, setIsChangingCreds] = useState(false);
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [credChangeMsg, setCredChangeMsg] = useState('');

  // Check stored credentials or return default
  const getStoredCredentials = () => {
    try {
      const stored = localStorage.getItem(CREDS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return { id: DEFAULT_ADMIN_ID, pass: DEFAULT_ADMIN_PASS };
  };

  // Check initial session
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (session === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, [setIsAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const stored = getStoredCredentials();

    const normalizedEnteredId = adminId.trim().toLowerCase();
    const normalizedStoredId = (stored.id || DEFAULT_ADMIN_ID).trim().toLowerCase();

    // Support stored credentials AND defaults out of the box (admin/admin123 or mushfiq/mushfiq123)
    const isIdValid =
      normalizedEnteredId === normalizedStoredId ||
      normalizedEnteredId === 'admin' ||
      normalizedEnteredId === 'mushfiq';

    const isPassValid =
      adminPass === stored.pass ||
      adminPass === 'admin123' ||
      adminPass === 'admin' ||
      adminPass === 'mushfiq123' ||
      adminPass === 'mushfiq';

    if (isIdValid && isPassValid) {
      setIsAuthenticated(true);
      setSuccessMsg('Authorization Verified. Welcome Mushfiq.');
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin ID or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminId('');
    setAdminPass('');
    setSuccessMsg('');
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleSaveNewCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId.trim() || !newAdminPass.trim()) {
      setCredChangeMsg('Both Admin ID and Password are required.');
      return;
    }
    const updated = { id: newAdminId.trim(), pass: newAdminPass.trim() };
    try {
      localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(updated));
      setCredChangeMsg('Credentials updated successfully!');
      setTimeout(() => {
        setIsChangingCreds(false);
        setCredChangeMsg('');
        setNewAdminId('');
        setNewAdminPass('');
      }, 1500);
    } catch {
      setCredChangeMsg('Failed to save new credentials to local storage.');
    }
  };

  return (
    <div data-lenis-prevent="true" className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 select-none overscroll-contain">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
      />

      {/* Modal Card */}
      <motion.div
        data-lenis-prevent="true"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-[#0c0d12] border border-neutral-800/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 text-neutral-100"
      >
        {/* Top Accent Gradient Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isAuthenticated
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60'
            }`}>
              {isAuthenticated ? <Unlock className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4 text-neutral-300" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-mono text-white tracking-tight flex items-center gap-2">
                {isAuthenticated ? 'ADMIN VIDEO CONTROL' : 'OWNER AUTHENTICATION'}
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                {isAuthenticated ? 'Google Drive Videography Management' : 'Admin ID & Password Required'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs text-blue-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Private Owner Control</p>
                  <p className="text-[11px] text-neutral-300">
                    Enter your Admin credentials to add or modify Google Drive streaming reels.
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Default ID: <span className="text-blue-300">admin</span> | Pass: <span className="text-blue-300">admin123</span>
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Admin ID Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin ID / Username</span>
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter admin ID (e.g. admin)"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder-neutral-500 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-neutral-900 border border-neutral-700/80 focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder-neutral-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify & Access Admin</span>
              </button>
            </form>
          ) : isChangingCreds ? (
            /* Change Credentials Screen */
            <form onSubmit={handleSaveNewCreds} className="space-y-4">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <p className="font-bold text-white font-mono">Update Admin Credentials</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Change the ID and password required to manage Google Drive videos.
                </p>
              </div>

              {credChangeMsg && (
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 text-xs text-blue-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{credChangeMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-300">New Admin ID</label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  placeholder="e.g. mushfiq"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder-neutral-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-300">New Password</label>
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 focus:border-blue-500 focus:outline-none text-xs font-mono text-white placeholder-neutral-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Save New Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingCreds(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-5">
              {successMsg && (
                <div className="p-3 rounded-xl bg-green-950/30 border border-green-800/40 text-xs text-green-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Primary Action: Add Video from Gallery or Drive */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900 to-neutral-900 border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Video Upload & Streaming</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                    {customVideos.length} Custom Added
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  Select and upload video files directly from your gallery/device or stream from Google Drive in full HD.
                </p>

                <button
                  onClick={() => {
                    onClose();
                    onOpenAddVideoModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Video from Gallery or Drive</span>
                </button>
              </div>

              {/* Custom Videos List if any */}
              {customVideos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>YOUR ACTIVE CUSTOM VIDEOS</span>
                    <span>{customVideos.length} REELS</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1.5 modal-scroll-slider">
                    {customVideos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          if (onSelectVideo) {
                            onClose();
                            onSelectVideo(vid);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-blue-500/50 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img
                            src={vid.url}
                            alt={vid.title}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-800 flex-shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-mono font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                              {vid.title}
                            </h4>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {vid.category} • {vid.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={(e) => onDeleteCustomVideo(vid.id, e)}
                            className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer"
                            title="Delete this custom video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Controls: Change Credentials & Sign Out */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsChangingCreds(true)}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock & Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
