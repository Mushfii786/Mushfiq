import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, X, Trash2, CheckCircle2, AlertTriangle, Shield, Filter, Search, RefreshCw, Clock } from 'lucide-react';
import { activityLogger, ActivityLogItem } from '../utils/activityLogger';

interface ActivityLogSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityLogSidebar({ isOpen, onClose }: ActivityLogSidebarProps) {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsubscribe = activityLogger.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'success' && log.status !== 'success') return false;
    if (filter === 'error' && log.status !== 'error') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return log.description.toLowerCase().includes(q) || log.target.toLowerCase().includes(q) || log.type.toLowerCase().includes(q);
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div data-lenis-prevent="true" className="fixed inset-0 z-[300] flex justify-end select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          className="relative w-full max-w-md h-full bg-[#080a12] border-l border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.25)] z-15 flex flex-col text-white font-sans overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#0d1224] to-[#080a12]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-['Syne'] tracking-wide text-white">Activity Log & Audit Trail</h3>
                <p className="text-[11px] text-neutral-400">Tracking CRUD operations & Firebase fetches</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filters & Search */}
          <div className="p-4 border-b border-white/10 bg-[#060810] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(['all', 'success', 'error'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={() => activityLogger.clear()}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Clear activity log history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit logs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 focus:border-blue-500 focus:outline-none text-xs text-white placeholder-neutral-500 font-mono"
              />
            </div>
          </div>

          {/* Log Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 modal-scroll-slider">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-2">
                <Clock className="w-8 h-8 text-neutral-600" />
                <p className="text-xs text-neutral-400 font-mono">No activity logs found matching criteria.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isError = log.status === 'error';
                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-2xl border transition-all space-y-1.5 ${
                      isError
                        ? 'bg-red-950/15 border-red-500/30 text-red-200'
                        : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/10 text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[9px] uppercase tracking-wider ${
                        log.type === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.type === 'UPDATE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        log.type === 'DELETE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        log.type === 'FETCH_ERROR' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        log.type === 'SAVE' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        log.type === 'RESET' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs font-medium leading-relaxed font-sans">{log.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-neutral-400 font-mono">
                      <span>Target: <strong className="text-white uppercase">{log.target}</strong></span>
                      <span className={isError ? 'text-red-400' : 'text-emerald-400'}>{log.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-[#060810] border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Total recorded: <strong className="text-white font-mono">{logs.length}</strong></span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Close Sidebar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default ActivityLogSidebar;
