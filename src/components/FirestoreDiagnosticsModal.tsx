import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Terminal, RefreshCw, CheckCircle2, AlertTriangle, Shield, Server, X, HardDrive, FileText, Activity, Layers, Check } from 'lucide-react';
import { db, fetchCatalogFromFirebase, fetchPhotographyCatalogFromFirebase, fetchAdminCredsFromFirebase, fetchContactMessagesFromFirebase } from '../utils/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirestoreDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirestoreDiagnosticsModal({ isOpen, onClose }: FirestoreDiagnosticsModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [videographyData, setVideographyData] = useState<any>(null);
  const [photographyData, setPhotographyData] = useState<any>(null);
  const [adminCredsData, setAdminCredsData] = useState<any>(null);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'videography' | 'photography' | 'messages' | 'logs'>('overview');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const fetchDiagnosticData = async () => {
    setRefreshing(true);
    const logs: string[] = [];
    try {
      // 1. Test Server Connection
      logs.push(`[${new Date().toLocaleTimeString()}] Testing server connection to Firestore...`);
      try {
        await getDocFromServer(doc(db, 'portfolios', 'videography_catalog'));
        setConnectionStatus('connected');
        logs.push(`[${new Date().toLocaleTimeString()}] ✓ Firestore server connection established successfully.`);
      } catch (connErr: any) {
        setConnectionStatus('error');
        logs.push(`[${new Date().toLocaleTimeString()}] ✕ Server connection warning: ${connErr.message}`);
      }

      // 2. Fetch Videography Catalog
      logs.push(`[${new Date().toLocaleTimeString()}] Fetching collection 'portfolios/videography_catalog'...`);
      const videoCatalog = await fetchCatalogFromFirebase();
      if (videoCatalog) {
        setVideographyData(videoCatalog);
        logs.push(`[${new Date().toLocaleTimeString()}] ✓ Videography catalog loaded: ${videoCatalog.videos?.length || 0} videos, ${videoCatalog.categories?.length || 0} categories.`);
      } else {
        setVideographyData({ empty: true });
        logs.push(`[${new Date().toLocaleTimeString()}] ⚠ Videography catalog document is empty or missing.`);
      }

      // 3. Fetch Photography Catalog
      logs.push(`[${new Date().toLocaleTimeString()}] Fetching collection 'portfolios/photography_catalog'...`);
      const photoCatalog = await fetchPhotographyCatalogFromFirebase();
      if (photoCatalog) {
        setPhotographyData(photoCatalog);
        logs.push(`[${new Date().toLocaleTimeString()}] ✓ Photography catalog loaded: ${photoCatalog.photos?.length || 0} photos, ${photoCatalog.categories?.length || 0} categories.`);
      } else {
        setPhotographyData({ empty: true });
        logs.push(`[${new Date().toLocaleTimeString()}] ⚠ Photography catalog document is empty or missing.`);
      }

      // 4. Fetch Admin Credentials
      logs.push(`[${new Date().toLocaleTimeString()}] Fetching document 'portfolios/admin_credentials'...`);
      const creds = await fetchAdminCredsFromFirebase();
      setAdminCredsData(creds || { status: 'Using default fallback credentials' });
      logs.push(`[${new Date().toLocaleTimeString()}] ✓ Admin credentials state verified.`);

      // 5. Fetch Contact Messages
      logs.push(`[${new Date().toLocaleTimeString()}] Fetching collection 'contact_messages'...`);
      const messages = await fetchContactMessagesFromFirebase();
      setContactMessages(messages);
      logs.push(`[${new Date().toLocaleTimeString()}] ✓ Contact messages loaded: ${messages.length} messages found.`);

    } catch (err: any) {
      setErrorLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error during diagnostics fetch: ${err.message}`]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setErrorLogs(prev => [...logs, ...prev]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDiagnosticData();
    }
  }, [isOpen]);

  const copyToClipboard = (data: any, sectionName: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div data-lenis-prevent="true" className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/92 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#090b14] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.25)] z-15 flex flex-col text-white font-sans overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#0d1224] via-[#090b14] to-[#0d1224]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold font-['Syne'] tracking-wide text-white">Firestore Diagnostic Utility</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    connectionStatus === 'connected' ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300' :
                    connectionStatus === 'error' ? 'bg-amber-500/15 border border-amber-400/40 text-amber-300' : 'bg-blue-500/15 border border-blue-400/40 text-blue-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      connectionStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                      connectionStatus === 'error' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'
                    }`} />
                    {connectionStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Live inspection of Firestore collections, documents, assets, and error logs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDiagnosticData}
                disabled={refreshing}
                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Diagnostics</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 bg-[#070911] overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Status', icon: Activity },
              { id: 'videography', label: `Videography Catalog (${videographyData?.videos?.length || 0})`, icon: Server },
              { id: 'photography', label: `Photography Catalog (${photographyData?.photos?.length || 0})`, icon: HardDrive },
              { id: 'messages', label: `Contact Messages (${contactMessages.length})`, icon: FileText },
              { id: 'logs', label: `Terminal Event Logs (${errorLogs.length})`, icon: Terminal },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive ? 'border-blue-500 text-white bg-blue-500/10' : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070911]/80 min-h-[380px] max-h-[60vh] modal-scroll-slider">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs text-neutral-400 font-mono">Querying Firestore collections and documents...</p>
              </div>
            ) : (
              <>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Videography Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1326] to-[#090b14] border border-blue-500/20 shadow-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-300">Videography Catalog</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">portfolios/videography_catalog</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-['Syne'] text-white">{videographyData?.videos?.length || 0}</span>
                          <span className="text-xs text-neutral-400">videos loaded</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-white/5">
                          <span>Categories: {videographyData?.categories?.length || 0}</span>
                          <span className="text-emerald-400 font-mono">Synced</span>
                        </div>
                      </div>

                      {/* Photography Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1326] to-[#090b14] border border-purple-500/20 shadow-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-300">Photography Catalog</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px]">portfolios/photography_catalog</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-['Syne'] text-white">{photographyData?.photos?.length || 0}</span>
                          <span className="text-xs text-neutral-400">photos loaded</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-white/5">
                          <span>Categories: {photographyData?.categories?.length || 0}</span>
                          <span className="text-emerald-400 font-mono">Synced</span>
                        </div>
                      </div>

                      {/* Messages Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1326] to-[#090b14] border border-emerald-500/20 shadow-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-300">Contact Messages</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">collection: contact_messages</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-['Syne'] text-white">{contactMessages.length}</span>
                          <span className="text-xs text-neutral-400">submissions</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-white/5">
                          <span>Status: Active</span>
                          <span className="text-emerald-400 font-mono">Listening</span>
                        </div>
                      </div>
                    </div>

                    {/* Rendering Diagnostic Tips */}
                    <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>Rendering & Asset Diagnostic Insights</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        If images or videos fail to render in the UI, check the following common causes:
                      </p>
                      <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4 font-sans">
                        <li><strong className="text-neutral-200">Invalid Media URLs / Paths:</strong> Ensure image/video URLs are valid HTTP/HTTPS links or imported local asset references.</li>
                        <li><strong className="text-neutral-200">Firestore Document Existence:</strong> If catalog documents are missing in Firestore, default sample data is loaded automatically. Verify document keys above.</li>
                        <li><strong className="text-neutral-200">Security Rules:</strong> Ensure Firestore security rules allow read/write access for authenticated admin sessions.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* VIDEOGRAPHY TAB */}
                {activeTab === 'videography' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-neutral-300 font-mono">
                        Collection: <span className="text-blue-400">portfolios</span> / Document: <span className="text-blue-400">videography_catalog</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(videographyData, 'videography')}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      >
                        {copiedSection === 'videography' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>{copiedSection === 'videography' ? 'Copied JSON!' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-blue-200 overflow-x-auto max-h-96">
                      <pre>{JSON.stringify(videographyData, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {/* PHOTOGRAPHY TAB */}
                {activeTab === 'photography' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-neutral-300 font-mono">
                        Collection: <span className="text-purple-400">portfolios</span> / Document: <span className="text-purple-400">photography_catalog</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(photographyData, 'photography')}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      >
                        {copiedSection === 'photography' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>{copiedSection === 'photography' ? 'Copied JSON!' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-purple-200 overflow-x-auto max-h-96">
                      <pre>{JSON.stringify(photographyData, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-neutral-300 font-mono">
                        Collection: <span className="text-emerald-400">contact_messages</span> ({contactMessages.length} total)
                      </div>
                      <button
                        onClick={() => copyToClipboard(contactMessages, 'messages')}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      >
                        {copiedSection === 'messages' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>{copiedSection === 'messages' ? 'Copied JSON!' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    {contactMessages.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500 text-xs">No contact messages recorded in Firestore yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {contactMessages.map((msg, idx) => (
                          <div key={msg.id || idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-white">{msg.name || 'Anonymous'} ({msg.email})</span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* LOGS TAB */}
                {activeTab === 'logs' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-300 font-mono">Terminal Diagnostic Log Events</span>
                      <button
                        onClick={() => copyToClipboard(errorLogs.join('\n'), 'logs')}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      >
                        {copiedSection === 'logs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5" />}
                        <span>{copiedSection === 'logs' ? 'Copied Logs!' : 'Copy Logs'}</span>
                      </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-emerald-400 space-y-1 max-h-96 overflow-y-auto">
                      {errorLogs.map((log, i) => (
                        <div key={i} className={log.includes('✕') || log.includes('Error') ? 'text-rose-400' : log.includes('⚠') ? 'text-amber-400' : 'text-emerald-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-[#070911] border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Firestore database: <strong className="text-white font-mono">{firebaseConfig.firestoreDatabaseId || '(default)'}</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer"
            >
              Close Diagnostics
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default FirestoreDiagnosticsModal;
