import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../AdminContext';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { loginWithGoogle, loginWithMasterKey, setIsStudioOpen } = useAdmin();

  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const success = loginWithMasterKey(adminId.trim(), adminPass.trim());
      setIsLoading(false);

      if (success) {
        onClose();
        setIsStudioOpen(true);
      } else {
        setErrorMsg('Invalid credentials. Check your Admin ID and Password.');
      }
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    const success = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (success) {
      onClose();
      setIsStudioOpen(true);
    } else {
      setErrorMsg('Google Sign-In failed or cancelled. You can also use Admin ID & Password.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C2E34]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#202126] border border-[#2C2E34] flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F4F4F5]">Portfolio Studio</h3>
                <p className="text-[11px] text-[#A1A1AA]">Admin Authentication</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#202126] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#202126] hover:bg-[#282930] text-[#F4F4F5] text-xs font-medium border border-[#2C2E34] transition-all cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#2C2E34]" />
              <span className="absolute px-2 bg-[#17181B] text-[10px] uppercase font-mono text-[#71717A]">
                or credentials
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                  Admin ID
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. Mushfii_786"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#111214] border border-[#2C2E34] text-[#F4F4F5] text-xs placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full px-3 py-2 pr-9 rounded-lg bg-[#111214] border border-[#2C2E34] text-[#F4F4F5] text-xs placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#A1A1AA]"
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-[0.99] mt-2"
              >
                <span>{isLoading ? 'Verifying...' : 'Access Admin Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-[#71717A] font-mono">
                Default Owner: Mushfii_786 / @Mushfii_786
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
