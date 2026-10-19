import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { ContactMessageItem } from '../types';
import { 
  Search, 
  Mail, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Clock, 
  Reply, 
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export function ContactInboxModule() {
  const { contactMessages, markMessageRead, archiveMessage, deleteMessage } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

  const filtered = contactMessages.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') return matchesSearch && !m.read && !m.archived;
    if (filter === 'archived') return matchesSearch && m.archived;
    return matchesSearch && !m.archived;
  });

  const handleSelectMessage = (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id, true);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Contact Form Inbox
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Read and respond to inquiries submitted by prospective clients and collaborators.
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-[#17181B] p-1 rounded-lg border border-[#2C2E34] text-xs font-mono">
          {(['all', 'unread', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded capitalize transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by sender, email or message..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#17181B] border border-[#2C2E34] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#17181B] border border-[#2C2E34] text-[#71717A] space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-[#2C2E34]" />
            <p className="text-xs">No inquiries matching your filter.</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                !msg.read
                  ? 'bg-[#1e1f26] border-purple-500/40 text-white'
                  : 'bg-[#17181B] border-[#2C2E34] text-[#A1A1AA] hover:border-[#3E414A]'
              }`}
            >
              <div className="flex items-center gap-3.5 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? 'bg-purple-400' : 'bg-transparent'}`} />
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{msg.name}</span>
                    <span className="text-[11px] font-mono text-[#71717A]">&lt;{msg.email}&gt;</span>
                  </div>
                  <p className="text-xs truncate text-[#A1A1AA] mt-0.5">{msg.subject || msg.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-[#71717A]">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Read Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-xl bg-[#17181B] border border-[#2C2E34] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2E34] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedMessage.name}</h3>
                <p className="text-xs font-mono text-[#A1A1AA]">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#71717A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">Subject</span>
              <p className="text-xs font-semibold text-white">{selectedMessage.subject || 'Portfolio Inquiry'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">Message</span>
              <p className="text-xs text-[#D4D4D8] leading-relaxed whitespace-pre-wrap p-3 rounded bg-[#111214] border border-[#2C2E34]">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2C2E34]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    archiveMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#202126] hover:bg-[#282930] text-xs text-[#A1A1AA] hover:text-white"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#202126] hover:bg-[#282930] text-xs text-[#A1A1AA] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-sm"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply by Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
