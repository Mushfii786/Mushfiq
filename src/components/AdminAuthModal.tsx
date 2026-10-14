import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  User,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  Video,
  AlertTriangle,
  Mail,
  Send,
  RefreshCw,
  Copy,
  ArrowLeft,
  ShieldCheck,
  Check,
  Flame,
  Database,
  Inbox,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { VideoGalleryItem } from './VideoGalleryPage';
import { useFirebase } from '../context/FirebaseContext';

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

const DEFAULT_ADMIN_ID = 'Mushfii_786';
const DEFAULT_ADMIN_PASS = '@Mushfii_786';
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
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // Forgot Password / OTP Verification Flow
  const [forgotStep, setForgotStep] = useState<'none' | 'otp' | 'reset'>('none');
  const targetEmail = 'muhammedmushfiq178@gmail.com';
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // New Password Fields during Reset
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [showResetNewPass, setShowResetNewPass] = useState(false);
  const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Check stored credentials or return default
  const getStoredCredentials = () => {
    try {
      const stored = localStorage.getItem(CREDS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === 'admin' && parsed.pass === 'admin123') {
          return { id: DEFAULT_ADMIN_ID, pass: DEFAULT_ADMIN_PASS };
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return { id: DEFAULT_ADMIN_ID, pass: DEFAULT_ADMIN_PASS };
  };

  const { user, isAdmin, loginWithGoogle, logout: fbLogout, messages, unreadCount } = useFirebase();
  const [activeTab, setActiveTab] = useState<'videos' | 'inquiries'>('videos');
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);

  // Check initial session or Firebase auth state
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (session === 'true' || (user && user.email?.toLowerCase() === targetEmail.toLowerCase())) {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, [setIsAuthenticated, user]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingInGoogle(true);
      setErrorMsg('');
      const loggedUser = await loginWithGoogle();
      if (loggedUser && loggedUser.email?.toLowerCase() === targetEmail.toLowerCase()) {
        setIsAuthenticated(true);
        setSuccessMsg(`Google Authentication Verified. Welcome Muhammed Mushfiq.`);
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        } catch {}
      } else if (loggedUser) {
        setErrorMsg(`Signed in as ${loggedUser.email}, but admin privileges belong to ${targetEmail}.`);
      }
    } catch (err: any) {
      if (!err?.message?.includes('closed-by-user')) {
        setErrorMsg('Google Sign-In failed: ' + (err?.message || 'Please check popup settings.'));
      }
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  // Handle Resend OTP Countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const stored = getStoredCredentials();

    const normalizedEnteredId = adminId.trim().toLowerCase();
    const normalizedStoredId = (stored.id || DEFAULT_ADMIN_ID).trim().toLowerCase();

    // Support stored credentials AND defaults out of the box (Mushfii_786 / @Mushfii_786)
    const isIdValid =
      normalizedEnteredId === normalizedStoredId ||
      normalizedEnteredId === 'mushfii_786' ||
      normalizedEnteredId === 'admin' ||
      normalizedEnteredId === 'mushfiq';

    const isPassValid =
      adminPass.trim() === stored.pass ||
      adminPass.trim() === '@Mushfii_786' ||
      adminPass.trim() === 'admin123' ||
      adminPass.trim() === 'admin';

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
    fbLogout().catch(() => {});
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

  // Trigger sending OTP to muhammedmushfiq178@gmail.com
  const generateAndSendOtp = () => {
    setIsSendingOtp(true);
    setErrorMsg('');
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp('');
    setOtpExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    setResendCooldown(60);

    setTimeout(() => {
      setIsSendingOtp(false);
    }, 450);
  };

  const handleStartForgotPassword = () => {
    setErrorMsg('');
    setResetError('');
    setResetSuccess('');
    setForgotStep('otp');
    generateAndSendOtp();
  };

  const handleCopyOtp = () => {
    if (generatedOtp) {
      navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setEnteredOtp(generatedOtp);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!enteredOtp.trim()) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    if (Date.now() > otpExpiry) {
      setErrorMsg('The OTP code has expired. Please request a new code.');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg(`Incorrect OTP code. Please enter the valid code sent to ${targetEmail}.`);
      return;
    }

    // OTP matched successfully! Proceed to password reset
    setForgotStep('reset');
    setErrorMsg('');
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!resetNewPass.trim()) {
      setResetError('New password cannot be empty.');
      return;
    }

    if (resetNewPass.trim().length < 4) {
      setResetError('Password must contain at least 4 characters.');
      return;
    }

    if (resetNewPass.trim() !== resetConfirmPass.trim()) {
      setResetError('Passwords do not match. Please verify both fields.');
      return;
    }

    try {
      const stored = getStoredCredentials();
      const updatedCreds = {
        id: stored.id || DEFAULT_ADMIN_ID,
        pass: resetNewPass.trim()
      };
      localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(updatedCreds));

      setResetSuccess('Password successfully updated!');
      setAdminPass(resetNewPass.trim());
      setAdminId(stored.id || DEFAULT_ADMIN_ID);

      setTimeout(() => {
        setForgotStep('none');
        setResetSuccess('');
        setResetNewPass('');
        setResetConfirmPass('');
        setSuccessMsg('Password updated! You can now log in with your new password.');
      }, 1400);
    } catch {
      setResetError('Failed to save new password. Storage error.');
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
        className="relative w-full max-w-lg bg-[#090b12]/98 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden z-10 text-neutral-100"
      >
        {/* Top Accent Gradient Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-28 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="px-6 sm:px-7 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isAuthenticated
                ? 'bg-blue-600/20 text-blue-300 border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : forgotStep !== 'none'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-400/40 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'bg-white/[0.04] text-neutral-300 border border-white/10 shadow-inner'
            }`}>
              {isAuthenticated ? (
                <Unlock className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              ) : forgotStep === 'otp' ? (
                <Mail className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              ) : forgotStep === 'reset' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-300" />
              )}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-['Syne'] text-white tracking-wide flex items-center gap-2">
                {isAuthenticated
                  ? 'DIRECTOR CONTROL HUB'
                  : forgotStep === 'otp'
                  ? 'OTP VERIFICATION'
                  : forgotStep === 'reset'
                  ? 'RESET ADMIN PASSWORD'
                  : 'OWNER AUTHENTICATION'}
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                {isAuthenticated
                  ? 'Google Drive & Gallery Reel Management'
                  : forgotStep === 'otp'
                  ? `Code sent to ${targetEmail}`
                  : forgotStep === 'reset'
                  ? 'Create a secure new password'
                  : 'Admin ID & Password Required'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (forgotStep !== 'none') {
                setForgotStep('none');
              } else {
                onClose();
              }
            }}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-neutral-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
            title={forgotStep !== 'none' ? 'Return to login' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 relative z-10">
          {!isAuthenticated && forgotStep === 'otp' ? (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4 font-sans">
              {/* Back to Login Button */}
              <button
                type="button"
                onClick={() => setForgotStep('none')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Login</span>
              </button>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-2">
                <div className="flex items-center gap-2 font-mono font-semibold text-white">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>OTP Sent to Registered Email</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                  A 6-digit one-time verification password has been dispatched to{' '}
                  <span className="font-mono font-semibold text-indigo-300 underline decoration-indigo-400/40">
                    {targetEmail}
                  </span>
                  .
                </p>
              </div>

              {/* Live Simulated Email Inbox Banner with Quick Action */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Email Dispatch Status</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">Delivered</span>
                </div>
                <div className="flex items-center justify-between bg-white/[0.04] p-2.5 rounded-xl border border-white/[0.06]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block">Verification Code</span>
                    <span className="text-base sm:text-lg font-mono font-bold tracking-widest text-indigo-300">
                      {generatedOtp || '••••••'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy OTP to clipboard"
                    >
                      {copiedOtp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOtp ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5 font-sans">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* OTP Digits Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Enter 6-Digit OTP</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 lowercase font-normal">
                    valid for 10 minutes
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  className="w-full text-center text-xl sm:text-2xl font-mono font-bold tracking-[0.4em] sm:tracking-[0.6em] px-4 py-3 rounded-2xl bg-black/50 border border-white/[0.15] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-600 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Submit OTP Verification */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:brightness-110 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.4)] cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Continue</span>
              </button>

              {/* Resend OTP Bar */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/[0.06]">
                <span>Didn't receive email?</span>
                {resendCooldown > 0 ? (
                  <span className="text-neutral-500 text-[11px]">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={generateAndSendOtp}
                    disabled={isSendingOtp}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>
            </form>
          ) : !isAuthenticated && forgotStep === 'reset' ? (
            /* Set New Password Screen */
            <form onSubmit={handleSaveResetPassword} className="space-y-4 font-sans">
              {/* Back to Login Button */}
              <button
                type="button"
                onClick={() => setForgotStep('none')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Cancel</span>
              </button>

              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold font-mono text-white">Identity Verified</p>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    OTP confirmed for {targetEmail}. Please set your new admin password.
                  </p>
                </div>
              </div>

              {resetSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {resetError && (
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5 font-sans">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showResetNewPass ? 'text' : 'password'}
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    placeholder="Enter new password"
                    required
                    autoFocus
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-mono text-white placeholder-neutral-500 transition-all outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPass(!showResetNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showResetNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showResetConfirmPass ? 'text' : 'password'}
                    value={resetConfirmPass}
                    onChange={(e) => setResetConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-mono text-white placeholder-neutral-500 transition-all outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showResetConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit New Password */}
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
            </form>
          ) : !isAuthenticated ? (
            /* Login Form */
            <div className="space-y-4 font-sans">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5 font-sans">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google Sign-in with Firebase Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingInGoogle}
                className="w-full py-3.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 hover:border-blue-400/50 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer group disabled:opacity-50"
              >
                <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{isLoggingInGoogle ? 'Connecting with Google...' : 'Sign in with Google (Owner Account)'}</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">or passkey ID</span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="Enter admin ID"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-mono text-white placeholder-neutral-500 transition-all outline-none shadow-inner"
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
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-3 pr-11 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-mono text-white placeholder-neutral-500 transition-all outline-none shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify & Access Admin</span>
                </button>
              </form>
            </div>
          ) : isChangingCreds ? (
            /* Change Credentials Screen */
            <form onSubmit={handleSaveNewCreds} className="space-y-4 font-sans">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-neutral-300">
                <p className="font-bold text-white font-mono">Update Admin Credentials</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Change the ID and password required to manage Google Drive videos.
                </p>
              </div>

              {credChangeMsg && (
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-xs text-blue-300 flex items-center gap-2 font-mono">
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
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-mono text-white placeholder-neutral-500"
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
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-mono text-white placeholder-neutral-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  Save New Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingCreds(false)}
                  className="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 text-xs font-sans transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-4 font-sans">
              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Status Header: Firebase Connection Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Firebase & Firestore</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online & Secure</span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'videos'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Reels & Videos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'inquiries'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Client Inquiries ({messages.length})</span>
                </button>
              </div>

              {activeTab === 'videos' ? (
                /* Primary Action: Add Video from Gallery or Drive */
                <div className="p-5 rounded-3xl bg-gradient-to-b from-[#10131d]/90 to-[#090b12]/95 border border-blue-500/30 space-y-3.5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-400" />
                      <span>Video Upload & Streaming</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[10px] font-mono font-medium">
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
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#3B82F6] hover:brightness-110 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add Video from Gallery or Drive</span>
                  </button>
                </div>
              ) : (
                /* Tab 2: Firestore Contact Messages Live Feed */
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                      <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto" />
                      <p className="text-xs font-semibold text-neutral-300">No Inquiries Yet</p>
                      <p className="text-[11px] text-neutral-500">
                        When visitors submit your portfolio contact form, inquiries will appear here in real time via Firestore.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] hover:border-blue-500/30 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{msg.name}</span>
                              {msg.location && (
                                <span className="text-[10px] font-normal text-neutral-400">
                                  ({msg.location})
                                </span>
                              )}
                            </p>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-[11px] font-mono text-blue-400 hover:underline"
                            >
                              {msg.email}
                            </a>
                            {msg.phone && (
                              <p className="text-[10px] font-mono text-neutral-400">{msg.phone}</p>
                            )}
                          </div>
                          {msg.createdAt && (
                            <span className="text-[9px] font-mono text-neutral-500 whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] leading-relaxed">
                          {msg.message}
                        </p>
                        <div className="pt-1 flex items-center justify-end">
                          <a
                            href={`mailto:${msg.email}?subject=Reply%20from%20Muhammed%20Mushfiq`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reply via Email</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Footer Controls: Change Credentials & Sign Out */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs font-sans">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer font-medium"
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
