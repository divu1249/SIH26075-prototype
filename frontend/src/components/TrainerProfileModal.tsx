import React from 'react';
import { Award, CheckCircle2, Star, BookOpen, ShieldCheck, X, Briefcase, GraduationCap } from 'lucide-react';

export interface TrainerCompetency {
  name: string;
  designation: string;
  institution: string;
  experienceYears: number;
  rating: number;
  verified: boolean;
  skills: string[];
  bio: string;
  publishedCoursesCount: number;
  accreditationPassRate: string;
}

interface TrainerProfileModalProps {
  isOpen: boolean;
  trainer: TrainerCompetency | null;
  onClose: () => void;
}

export const TrainerProfileModal: React.FC<TrainerProfileModalProps> = ({
  isOpen,
  trainer,
  onClose,
}) => {
  if (!isOpen || !trainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
            {trainer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{trainer.name}</h3>
              {trainer.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={12} /> Admin Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{trainer.designation} • {trainer.institution}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={13} fill="currentColor" /> {trainer.rating} Rating
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase size={12} /> {trainer.experienceYears}+ Years Domain Exp.
              </span>
            </div>
          </div>
        </div>

        {/* Competency & Verification Body */}
        <div className="py-4 space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Faculty Biography
            </span>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {trainer.bio}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Verified Competencies & Subject Specialization
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {trainer.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300 font-semibold border border-blue-200/60 dark:border-indigo-800/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <div className="text-[10px] font-bold uppercase text-slate-400">Active Curricula</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {trainer.publishedCoursesCount} Courses
              </div>
            </div>
            <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <div className="text-[10px] font-bold uppercase text-slate-400">Learner Success Rate</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {trainer.accreditationPassRate}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-bold text-xs hover:bg-blue-600 dark:hover:bg-indigo-600 transition"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};

export default TrainerProfileModal;