import React, { useState } from 'react';
import {
  Settings,
  Database,
  Key,
  Shield,
  Server,
  RefreshCw,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Save,
  Layers,
  FileCode,
  Copy
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { isFirebaseConfigured, firebaseConfig } from '../../lib/firebase';
import { migrateInitialContentToFirestore, MigrationReport } from '../../services/contentService';

export function SiteSettingsManager() {
  const { settings, updateSettings, isFirebaseActive } = useSiteContent();
  const { user, resetPassword } = useAdminAuth();

  const [settingsForm, setSettingsForm] = useState(settings);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResettingPass, setIsResettingPass] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = async () => {
    await updateSettings(settingsForm);
    showToast('Site settings updated successfully');
  };

  const handleRunMigration = async () => {
    setIsMigrating(true);
    setMigrationReport(null);
    try {
      const report = await migrateInitialContentToFirestore();
      setMigrationReport(report);
      if (report.errors.length === 0) {
        showToast('Initial portfolio content successfully imported to Firestore!');
      } else {
        showToast('Migration completed with some warnings.');
      }
    } catch (e: any) {
      showToast(`Migration failed: ${e.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPass(true);
    try {
      await resetPassword(user.email);
      showToast(`Password reset link sent to ${user.email}`);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsResettingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-orange-500" />
          <span>Site Settings & Firebase Infrastructure</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure global metadata, manage Firebase connection status, and run data migrations.
        </p>
      </div>

      {/* 1. Firebase Infrastructure Status Card */}
      <div className="p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Firebase Services Connection
            </h2>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 ${
              isFirebaseActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseActive ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{isFirebaseActive ? 'Live Firebase Active' : 'Offline Fallback Active'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Project ID</span>
            <span className="text-neutral-200 truncate block">
              {firebaseConfig.projectId || 'Not set (using offline mode)'}
            </span>
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Storage Bucket</span>
            <span className="text-neutral-200 truncate block">
              {firebaseConfig.storageBucket || 'Not set (using offline mode)'}
            </span>
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Auth Domain</span>
            <span className="text-neutral-200 truncate block">
              {firebaseConfig.authDomain || 'Not set (using offline mode)'}
            </span>
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Target Platform</span>
            <span className="text-neutral-200 truncate block">React 19 Vite SPA / Vercel</span>
          </div>
        </div>

        {!isFirebaseActive && (
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs text-neutral-300">
            <span className="font-semibold text-white block">How to connect your live Firebase project:</span>
            <ol className="list-decimal list-inside space-y-1 text-neutral-400">
              <li>Open your project settings in the Firebase Console (console.firebase.google.com).</li>
              <li>Add a Web App and copy your config keys.</li>
              <li>Add them to your local <code className="text-orange-400">.env</code> file or Vercel Environment Variables.</li>
              <li>Redeploy or restart Vite dev server.</li>
            </ol>
          </div>
        )}
      </div>

      {/* 2. Idempotent Data Migration Tool */}
      <div className="p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              One-Click Database Migration
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">Idempotent</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Import all existing portfolio projects, photography galleries, videography reels, and site content from the codebase into your Cloud Firestore database. Existing records with matching IDs will not be overwritten or duplicated.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleRunMigration}
            disabled={isMigrating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isMigrating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{isMigrating ? 'Migrating Database Records...' : 'Import Portfolio to Firestore'}</span>
          </button>
        </div>

        {/* Migration Report */}
        {migrationReport && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs font-mono">
            <span className="font-bold text-white block">Migration Results:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-300">
              <div>Photos: <strong className="text-emerald-400">{migrationReport.photosMigrated}</strong> new ({migrationReport.photosSkipped} skipped)</div>
              <div>Videos: <strong className="text-emerald-400">{migrationReport.videosMigrated}</strong> new ({migrationReport.videosSkipped} skipped)</div>
              <div>Projects: <strong className="text-emerald-400">{migrationReport.projectsMigrated}</strong> new ({migrationReport.projectsSkipped} skipped)</div>
              <div>Global Content: <strong className="text-emerald-400">{migrationReport.siteContentMigrated ? 'Imported' : 'Existing'}</strong></div>
            </div>
            {migrationReport.errors.length > 0 && (
              <div className="mt-2 text-red-400 space-y-1">
                {migrationReport.errors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Global Settings & Metadata */}
      <div className="p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Global Website Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300">Brand Name</label>
            <input
              type="text"
              value={settingsForm.siteName || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300">Social Handle</label>
            <input
              type="text"
              value={settingsForm.handle || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, handle: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-neutral-300">Browser Page Title</label>
            <input
              type="text"
              value={settingsForm.siteTitle || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-neutral-300">Meta SEO Description</label>
            <textarea
              rows={2}
              value={settingsForm.metaDescription || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white resize-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Administrator Security & Password Management */}
      <div className="p-6 rounded-2xl bg-[#12151b] border border-neutral-800/80 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
          <Key className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            Admin Account & Credentials
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-semibold text-white block">Current Logged In Administrator</span>
            <span className="text-neutral-400 font-mono">{user?.email || 'muhammedmushfiq178@gmail.com'}</span>
          </div>

          <button
            type="button"
            onClick={handleSendPasswordReset}
            disabled={isResettingPass}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold cursor-pointer"
          >
            {isResettingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
            <span>Send Password Reset Email</span>
          </button>
        </div>
      </div>

    </div>
  );
}
