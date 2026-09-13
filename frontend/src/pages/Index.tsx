import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AcademiaLogo from '../components/AcademiaLogo';
import AuthModal from '../components/AuthModal';
import CourseViewerModal from '../components/CourseViewerModal';
import CertificateModal from '../components/CertificateModal';
import AdminConsole from '../components/AdminConsole';
import AnalyticsView from '../components/AnalyticsView';
import CreateModuleModal from '../components/CreateModuleModal';
import CreateQuizModal from '../components/CreateQuizModal';{
  title: string;
  description: string;
  duration_minutes: number;
  content: string;
  order_index: number;
}

interface Assessment {
  id: number;
  module_id: number;
  title: string;
  passing_score: number;
}

interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  modules: Module[];
  assessments: Assessment[];
}

export const Index: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'analytics' | 'admin'>('catalog');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeCertificateHash, setActiveCertificateHash] = useState<string | null>(null);
  const [createModuleCourseId, setCreateModuleCourseId] = useState<number | null>(null);
  const [createQuizModuleId, setCreateQuizModuleId] = useState<number | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed to load courses from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <AcademiaLogo size={34} />

          {user && (
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === 'catalog'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Curriculum Hub
              </button>
              {(user.role === 'trainer' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cohort Telemetry
                </button>
              )}
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    activeTab === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Central Governance
                </button>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Color Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              Portal Login
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full grow">
        {!user ? (
          /* ================= GUEST LANDING SHOWCASE ================= */
          <div className="space-y-20 py-4">
            {/* Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Smart India Hackathon • Problem Statement SIH 26075</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Decentralized Capacity Building & Verifiable Skill Accreditation
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                An institutional training ecosystem enabling scalable curriculum deployment, isolated role-based workspaces, server-side grading, and cryptographic hash verification.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
                >
                  Enter Demonstration Gateway
                </button>
                <a
                  href="#features"
                  className="px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Explore Architecture
                </a>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">3-Tier</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Role-Based Access</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">SHA-256</div>
                <div className="text-xs text-slate-500 font-medium mt-1">HMAC Signatures</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Server Verification</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">Stateless</div>
                <div className="text-xs text-slate-500 font-medium mt-1">JWT Handshake</div>
              </div>
            </div>

            {/* Architectural Pillars */}
            <div id="features" className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-black tracking-tight">Platform Core Capabilities</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Built to prevent credential falsification and streamline nationwide training administration.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 flex items-center justify-center text-xl text-indigo-600 dark:text-indigo-400">
                    🛡️
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Role Segregation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Granular RBAC ensures candidates read content and submit answers, trainers curate modules and monitor cohorts, and central administrators verify integrity logs.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/70 flex items-center justify-center text-xl text-cyan-600 dark:text-cyan-400">
                    ⚡
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Air-Gapped Evaluation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    All assessment validation happens strictly backend-side. Answer vectors and passing thresholds are isolated from browser network inspection.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-xl text-emerald-600 dark:text-emerald-400">
                    🔏
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cryptographic Provenance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Module completions generate a tamper-evident SHA-256 digital certificate containing user IDs, timestamps, and verifiable server signatures.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Personas Card */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold">Evaluator & Presentation Walkthrough</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Access the live system directly using pre-configured testing roles:
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Trainee Candidate</div>
                  <div className="text-sm font-mono mt-2 font-medium">aisha@connect.edu</div>
                  <div className="text-xs font-mono text-slate-400">password123</div>
                  <div className="text-[11px] text-slate-500 mt-2">Course completion & certification flow</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Trainer Instructor</div>
                  <div className="text-sm font-mono mt-2 font-medium">aarav@connect.edu</div>
                  <div className="text-xs font-mono text-slate-400">password123</div>
                  <div className="text-[11px] text-slate-500 mt-2">Curriculum authoring & cohort statistics</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Central Admin</div>
                  <div className="text-sm font-mono mt-2 font-medium truncate">admin.root@capacityconnect.gov</div>
                  <div className="text-xs font-mono text-slate-400">adminsecret2026</div>
                  <div className="text-[11px] text-slate-500 mt-2">Audit logs & registry controls</div>
                </div>
              </div>
            </div>

            {/* Read-Only Course Catalog Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Standard Institutional Curricula</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pre-seeded learning pathways available across the network</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-400 font-mono text-sm">Querying active tracks from backend API...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-400">
                            {course.modules?.length || 0} Modules • {course.assessments?.length || 0} Checkpoint
                          </span>
                        </div>
                        <h4 className="text-lg font-bold">{course.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="mt-6 w-full py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                      >
                        Sign In to Enroll
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED WORKSPACE ================= */
          <div className="space-y-8">
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Assigned Curriculum</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Active Workspace: <span className="capitalize font-semibold text-slate-800 dark:text-slate-200">{user.role}</span>
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-slate-400 font-mono text-sm">Fetching modules...</div>
                ) : (
                  <div className="grid gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {course.code}
                            </span>
                            <h3 className="text-xl font-bold mt-1">{course.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                              {course.description}
                            </p>
                          </div>
                          {(user.role === 'trainer' || user.role === 'admin') && (
                            <button
                              onClick={() => setCreateModuleCourseId(course.id)}
                              className="shrink-0 text-xs font-bold px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                            >
                              + Add Module
                            </button>
                          )}
                        </div>

                        {/* Module Grid */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Learning Modules ({course.modules?.length || 0})
                          </h4>
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {course.modules?.map((m) => (
                              <div
                                key={m.id}
                                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="text-xs font-mono text-slate-400 mb-1">
                                    {m.duration_minutes} mins
                                  </div>
                                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {m.title}
                                  </h5>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                    {m.description}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                  <button
                                    onClick={() => setSelectedModule(m)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                  >
                                    Open Reader →
                                  </button>
                                  {(user.role === 'trainer' || user.role === 'admin') && (
                                    <button
                                      onClick={() => setCreateQuizModuleId(m.id)}
                                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                    >
                                      + Quiz
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assessments */}
                        {course.assessments && course.assessments.length > 0 && (
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                              Verification Checkpoints
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {course.assessments.map((a) => (
                                <button
                                  key={a.id}
                                  onClick={() => setSelectedAssessment(a)}
                                  className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                                >
                                  <span>✍️</span> {a.title} (Pass Mark: {a.passing_score}%)
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (user.role === 'trainer' || user.role === 'admin') && (
              <AnalyticsView />
            )}

            {activeTab === 'admin' && user.role === 'admin' && (
              <AdminConsole />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Academia Prototype • Smart India Hackathon 2026 • Problem Statement SIH 26075
      </footer>

      {/* Modals */}
      {authModalOpen && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}

      {selectedModule && (
        <CourseViewerModal
          isOpen={!!selectedModule}
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
        />
      )}

      {selectedAssessment && (
        <CreateQuizModal
          isOpen={!!selectedAssessment}
          assessment={selectedAssessment}
          onSuccess={(certHash) => {
            setSelectedAssessment(null);
            if (certHash) setActiveCertificateHash(certHash);
          }}
          onClose={() => setSelectedAssessment(null)}
        />
      )}

      {activeCertificateHash && (
        <CertificateModal
          isOpen={!!activeCertificateHash}
          hash={activeCertificateHash}
          onClose={() => setActiveCertificateHash(null)}
        />
      )}

      {createModuleCourseId !== null && (
        <CreateModuleModal
          isOpen={createModuleCourseId !== null}
          courseId={createModuleCourseId}
          onSuccess={() => {
            setCreateModuleCourseId(null);
            fetchCourses();
          }}
          onClose={() => setCreateModuleCourseId(null)}
        />
      )}
    </div>
  );
};

export default Index;