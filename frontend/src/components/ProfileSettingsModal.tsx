import React, { useState } from 'react';
import { Building2, Mail, Sparkles, User, X, Briefcase, FileText } from 'lucide-react';

export interface UserProfileData {
  name: string;
  email: string;
  institution: string;
  headline?: string;
  bio?: string;
  departmentOrStandard?: string;
  skills?: string;
}

interface ProfileSettingsModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onSave: (updated: UserProfileData) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user?.name || user?.fullName || 'Candidate');
  const [email, setEmail] = useState(user?.email || '');
  const [institution, setInstitution] = useState(user?.institution || 'Capacity Connect Central Node');
  const [headline, setHeadline] = useState(
    user?.headline || 'Lead Fellow in Distributed Computing Systems'
  );
  const [bio, setBio] = useState(
    user?.bio || 'Engaged in nationwide capacity building, skill verification, and technical curriculum mastery.'
  );
  const [skills, setSkills] = useState(
    user?.skills || 'FastAPI, Microservices, Distributed Systems, Cloud Architecture'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      email: email.trim(),
      institution: institution.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      skills: skills.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              Edit Institutional Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your public identity, institutional affiliation, and verified credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Full Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Affiliated Institution / Organization
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Professional Headline / Designation
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Competencies & Subject Expertise (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Distributed Systems, Python, RBAC, Microservices"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/25 transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;