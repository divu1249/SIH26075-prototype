import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (announcement: { title: string; content: string }) => void;
}

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onBroadcast({ title: title.trim(), content: content.trim() });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Megaphone size={18} />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Broadcast Announcement
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Post an organizational announcement visible across Trainee and Trainer workspaces.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SIH 26075 Final Cohort Assessment Window Open"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Announcement Details
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide directives, schedule updates, or system policy notes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
          >
            Dispatch Central Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementsModal;