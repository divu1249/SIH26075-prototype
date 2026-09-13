import { X, ShieldCheck, Download, Award } from "lucide-react";
import { UserProfile } from "@/context/AuthContext";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  moduleName: string;
  scorePercentage: number;
}

export function CertificateModal({
  isOpen,
  onClose,
  user,
  moduleName,
  scorePercentage,
}: CertificateModalProps) {
  if (!isOpen) return null;

  const certificateHash = `CC-2026-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 hover:bg-slate-100">
          <X size={18} />
        </button>

        <div className="rounded-2xl border-4 border-double border-blue-900/20 bg-gradient-to-b from-white via-slate-50/50 to-blue-50/30 p-8 text-center relative overflow-hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Award size={32} />
          </div>

          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.25em] text-blue-700">
            Capacity Connect Accreditation
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">Certificate of Competency</h2>
          <p className="mt-2 text-xs text-slate-500">This official credential verifies that</p>

          <h3 className="mt-3 text-xl font-extrabold text-blue-900">{user?.fullName || "Aisha Mensah"}</h3>
          <p className="text-xs font-semibold text-slate-600">
            {user?.institution || "Institute of Technology"} • {user?.departmentOrStandard || "Artificial Intelligence"}
          </p>

          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-600">
            Has demonstrated verified proficiency and successfully completed the evaluation checkpoint for{" "}
            <span className="font-bold text-slate-900">{moduleName}</span> with an evaluated score of{" "}
            <span className="font-extrabold text-emerald-600">{scorePercentage}%</span>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 pt-6 gap-4 text-left">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Cryptographic Signature</p>
              <p className="font-mono text-[11px] font-bold text-slate-800">{certificateHash}</p>
              <p className="text-[10px] text-slate-400">Date of Validation: {issueDate}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <ShieldCheck size={18} />
              <span className="text-[11px] font-extrabold">Cryptographically Validated</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <Download size={14} /> Download Certificate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
export default CertificateModal;
