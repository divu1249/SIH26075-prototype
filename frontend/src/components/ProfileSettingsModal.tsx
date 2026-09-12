import { useState, useEffect } from "react";
import { X, Building2, KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [departmentOrStandard, setDepartmentOrStandard] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setInstitution(user.institution);
      setDepartmentOrStandard(user.departmentOrStandard);
      setIdentityNumber(user.identityNumber || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      institution,
      departmentOrStandard,
      identityNumber,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                Institutional ID & Settings
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-extrabold text-blue-700 uppercase">
                {user.role}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">Manage Profile Credentials</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-xs">
              {fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{fullName || user.username}</p>
              <p className="font-mono text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 font-mono">
              MUTUAL RBAC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Contact Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Building2 size={15} className="text-blue-600" />
              Academic & Institutional Registry
            </p>

            <div>
              <label className="text-[10px] font-bold text-slate-500">Institution / University</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500">Branch / Department</label>
                <input
                  type="text"
                  required
                  value={departmentOrStandard}
                  onChange={(e) => setDepartmentOrStandard(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500">
                  {user.role === "Trainer" ? "Faculty Code" : "Roll / Enrollment ID"}
                </label>
                <input
                  type="text"
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <KeyRound size={13} className="text-slate-400" />
              Change Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {savedNotice && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={16} /> Credentials updated successfully!
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}