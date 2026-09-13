import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  KeyRound,
  FileCode,
  Search,
} from "lucide-react";
import {
  initialVerifications,
  auditLogs,
  VerificationRequest,
} from "@/data/adminMockData";

export function AdminConsole() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>(initialVerifications);
  const [activeTab, setActiveTab] = useState<"verification" | "audit">("verification");
  const [filterQuery, setFilterQuery] = useState("");

  const handleDecision = (id: string, decision: "Approved" | "Rejected") => {
    setVerifications((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: decision } : req))
    );
  };

  const pendingCount = verifications.filter((v) => v.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Pending Educator Vetting</span>
            <Users size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Requires administrative signature</p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Affiliated Institutions</span>
            <Building2 size={16} className="text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">18</p>
          <p className="text-[10px] text-slate-400 mt-1">Universities, Polytechs, NGOs</p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Total Issued Hashes</span>
            <KeyRound size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">1,248</p>
          <p className="text-[10px] text-slate-400 mt-1">Tamper-evident credentials</p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Audit System Status</span>
            <ShieldCheck size={16} className="text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-600">Active</p>
          <p className="text-[10px] text-slate-400 mt-1">SHA-256 validation online</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("verification")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
            activeTab === "verification"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldAlert size={15} />
          Educator Accreditation Queue
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-700">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
            activeTab === "audit"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCode size={15} />
          Cryptographic Ledger & Security Logs
        </button>
      </div>

      {activeTab === "verification" && (
        <div className="surface-card overflow-hidden">
          <div className="border-b border-slate-100 p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Institutional Faculty Verification</h3>
              <p className="text-[11px] text-slate-500">
                Validate credentials against official collegiate registries before authorizing course publication.
              </p>
            </div>
            <div className="relative mt-2 sm:mt-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter applicants..."
                className="h-8 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[11px] outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {verifications
              .filter(
                (v) =>
                  v.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  v.institution.toLowerCase().includes(filterQuery.toLowerCase())
              )
              .map((req) => (
                <div key={req.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{req.fullName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{req.email}</span>
                      <span className="text-[10px] text-slate-300">• {req.appliedDate}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {req.institution} — <span className="font-semibold">{req.department}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">Faculty ID: {req.facultyCode}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleDecision(req.id, "Rejected")}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, "Approved")}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
                        >
                          <CheckCircle2 size={14} /> Grant Accreditation
                        </button>
                      </>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          req.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {req.status === "Approved" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="surface-card overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h3 className="text-sm font-extrabold text-slate-900">Cryptographic System Audit Trail</h3>
            <p className="text-[11px] text-slate-500">
              Deterministic, append-only security actions generated by authentication and assessment APIs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="border-b border-slate-100 bg-slate-50 font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Event ID</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">Actor</th>
                  <th className="px-4 py-2.5">Action Executed</th>
                  <th className="px-4 py-2.5">Resource Target</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-bold text-slate-900">{log.id}</td>
                    <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
                    <td className="px-4 py-3 text-blue-700">{log.actor}</td>
                    <td className="px-4 py-3 font-semibold">{log.action}</td>
                    <td className="px-4 py-3 text-[10px] text-slate-500 max-w-xs truncate" title={log.resource}>
                      {log.resource}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700"
                            : log.status === "BLOCKED"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminConsole;
