import { useState } from "react";
import { X, GraduationCap, School, ShieldAlert, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import { useAuth, PublicRole } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<PublicRole>("Trainee");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [departmentOrStandard, setDepartmentOrStandard] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");

  const [adminMode, setAdminMode] = useState(false);
  const [adminSecretKey, setAdminSecretKey] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Use adminSecretKey when in admin mode, otherwise loginPass
  const passwordToSubmit = adminMode ? adminSecretKey : loginPass;
  await login({ email: loginEmail, pass: passwordToSubmit });
  onClose();
};

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      fullName,
      email,
      phone,
      pass: password,
      role: selectedRole,
      institution,
      departmentOrStandard,
      identityNumber,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
              {adminMode ? "Security Clearance" : mode === "login" ? "Account Gateway" : "Onboarding & Registration"}
            </span>
            <h2 className="text-xl font-extrabold text-slate-950">
              {adminMode
                ? "Administrative Console Login"
                : mode === "login"
                ? "Sign into Capacity Connect"
                : `Register as ${selectedRole}`}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {!adminMode && (
          <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {mode === "login" && !adminMode && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600">Email Address / User ID</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="divyansh@institution.edu"
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Password</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
              Authenticate & Proceed <ArrowRight size={14} />
            </button>
          </form>
        )}

        {mode === "register" && !adminMode && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600">I am joining as a:</label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("Trainee")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    selectedRole === "Trainee"
                      ? "border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-600/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap size={16} /> Learner / Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("Trainer")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    selectedRole === "Trainer"
                      ? "border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-600/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <School size={16} /> Educator / Trainer
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Accounts are mutually exclusive to maintain strict academic role boundaries.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Divyansh Chauhan"
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Phone / Mobile</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@college.edu"
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-3">
              <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck size={14} className="text-blue-600" />
                {selectedRole === "Trainee" ? "Student Academic Profile" : "Educator Verification Profile"}
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-500">
                  {selectedRole === "Trainee" ? "School / College / University Name" : "Institute / Academy / Organization"}
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder={selectedRole === "Trainee" ? "e.g. ADGITM, Delhi" : "e.g. Department of Technical Education"}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">
                    {selectedRole === "Trainee" ? "Branch / Standard / Sem" : "Department / Subject Domain"}
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentOrStandard}
                    onChange={(e) => setDepartmentOrStandard(e.target.value)}
                    placeholder={selectedRole === "Trainee" ? "e.g. B.Tech AI (Sem 5)" : "e.g. Computer Science & AI"}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">
                    {selectedRole === "Trainee" ? "Roll No / Enrollment ID" : "Faculty Code / Verification ID"}
                  </label>
                  <input
                    type="text"
                    required
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    placeholder={selectedRole === "Trainee" ? "e.g. 04215602722" : "e.g. FAC-2024-991"}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
              Complete Registration <CheckCircle2 size={15} />
            </button>
          </form>
        )}

        {adminMode && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-amber-800 text-xs flex gap-2">
              <ShieldAlert size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <span>Restricted Root Access. All credentialed audits and role actions are cryptographically logged.</span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Root Admin Identity</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin.root@capacityconnect.gov"
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Admin Secret Key / Token</label>
              <input
                type="password"
                required
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
            >
              Authorize System Admin <ArrowRight size={14} />
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Protected by OAuth2 & Scoped Claims</span>
          <button
            type="button"
            onClick={() => setAdminMode(!adminMode)}
            className="text-[10px] text-slate-400 hover:text-slate-600 underline font-mono"
          >
            {adminMode ? "Return to Standard Portal" : "Admin Console Gateway"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AuthModal;
export { AuthModal };