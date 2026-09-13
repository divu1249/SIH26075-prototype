import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  courseTitle: string;
  trainerName: string;
  onClose: () => void;
  onSubmitFeedback: (feedback: { rating: number; comment: string }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  courseTitle,
  trainerName,
  onClose,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({ rating, comment });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 animate-bounce" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Feedback Submitted</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your evaluation is now mapped into {trainerName}'s verified public competency score.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-indigo-400">
                Continuous Quality Loop • SIH 26075
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Curriculum & Trainer Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track: <span className="font-semibold text-slate-700 dark:text-slate-200">{courseTitle}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                Trainer Competency & Course Clarity
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Constructive Observations
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment on lecture clarity, Kaggle-style notes, and checkpoint difficulty..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Submit Feedback to Capacity Connect
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;