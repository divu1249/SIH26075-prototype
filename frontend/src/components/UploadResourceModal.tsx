import React, { useState } from 'react';
import { Upload, FileText, Video, Link2, X } from 'lucide-react';

interface UploadResourceModalProps {
  isOpen: boolean;
  courses: { id: number; title: string }[];
  onClose: () => void;
  onUpload: (resource: {
    courseId: number;
    title: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
  }) => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  courses,
  onClose,
  onUpload,
}) => {
  const [courseId, setCourseId] = useState<number>(courses[0]?.id || 1);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'video' | 'link'>('pdf');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onUpload({ courseId, title: title.trim(), type, url: url.trim() });
    setTitle('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Upload Learning Resource
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Attach multi-format study assets to your active training track (Slide 3).
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Select Course Track
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Resource Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Concurrency Lecture Slides (PDF)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Resource Asset Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('pdf')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  type === 'pdf'
                    ? 'border-blue-600 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <FileText size={14} /> PDF Note
              </button>
              <button
                type="button"
                onClick={() => setType('video')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  type === 'video'
                    ? 'border-blue-600 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <Video size={14} /> Stream Link
              </button>
              <button
                type="button"
                onClick={() => setType('link')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  type === 'link'
                    ? 'border-blue-600 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <Link2 size={14} /> Code Repo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Media Link or Asset Endpoint
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://s3.amazonaws.com/capacityconnect/lecture.pdf"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
          >
            Publish Resource to Open Library
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResourceModal;