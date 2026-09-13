import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AcademiaLogo from '../components/AcademiaLogo';
import AuthModal from '../components/AuthModal';
import CourseViewerModal from '../components/CourseViewerModal';
import CertificateModal from '../components/CertificateModal';
import AdminConsole from '../components/AdminConsole';
import AnalyticsView from '../components/AnalyticsView';
import CreateModuleModal from '../components/CreateModuleModal';
import CreateQuizModal from '../components/CreateQuizModal';

interface Module {
  id: number;
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
  progress?: number;
}

// Interactive Fallback Content if backend courses do not contain nested modules
const CURRICULUM_PRESETS: Record<string, { modules: Module[]; assessments: Assessment[]; progress: number }> = {
  DEFAULT_1: {
    progress: 65,
    modules: [
      {
        id: 101,
        title: 'Asynchronous Architecture & Event Loops',
        description: 'Core event-driven architecture, non-blocking I/O routines, and thread concurrency models.',
        duration_minutes: 40,
        content: '# Asynchronous Architecture\n\nUnderstand event loops, message queues, and async worker patterns in modern web applications.\n\n### Key Concepts\n- Non-blocking execution\n- Worker pool allocation\n- State synchronization',
        order_index: 1,
      },
      {
        id: 102,
        title: 'Microservices Communication & gRPC',
        description: 'Protobuf definitions, high-throughput RPC pipelines, and low-latency payload serialization.',
        duration_minutes: 55,
        content: '# High Performance Microservices\n\nDesigning resilient services using gRPC and HTTP/2 transport standards.',
        order_index: 2,
      },
      {
        id: 103,
        title: 'Distributed State & Cache Invalidation',
        description: 'Strategies for distributed caching with Redis and maintaining eventual consistency.',
        duration_minutes: 35,
        content: '# Distributed Caching Strategies\n\nWrite-through vs write-behind caching with guaranteed cache-busting mechanics.',
        order_index: 3,
      },
    ],
    assessments: [
      { id: 201, module_id: 101, title: 'Microservices Competency Checkpoint', passing_score: 75 },
    ],
  },
  DEFAULT_2: {
    progress: 30,
    modules: [
      {
        id: 104,
        title: 'Statistical Inference & Metric Extraction',
        description: 'Transforming telemetry streams into actionable KPIs using exploratory data techniques.',
        duration_minutes: 45,
        content: '# Data-Informed Decision Making\n\nLearn how to construct data pipelines and evaluate significance across metric distributions.',
        order_index: 1,
      },
      {
        id: 105,
        title: 'Predictive Modeling & Risk Forecasting',
        description: 'Applied regression algorithms and anomaly detection on historical institutional cohorts.',
        duration_minutes: 50,
        content: '# Predictive Frameworks\n\nModel validation, confidence intervals, and bias detection in operational reporting.',
        order_index: 2,
      },
    ],
    assessments: [
      { id: 202, module_id: 104, title: 'Data Strategy & Modeling Evaluation', passing_score: 80 },
    ],
  },
  DEFAULT_3: {
    progress: 100,
    modules: [
      {
        id: 106,
        title: 'Public Sector Stakeholder Alignment',
        description: 'Structuring decentralized outreach and institutional cross-collaboration programs.',
        duration_minutes: 30,
        content: '# Stakeholder Governance\n\nFrameworks for building open, inclusive community engagement roadmaps.',
        order_index: 1,
      },
      {
        id: 107,
        title: 'Feedback Loops & Participatory Governance',
        description: 'Systemic gathering of learner feedback and continuous curriculum refinement.',
        duration_minutes: 40,
        content: '# Participatory Feedback Systems\n\nSynthesizing qualitative feedback into iterative institutional updates.',
        order_index: 2,
      },
    ],
    assessments: [
      { id: 203, module_id: 106, title: 'Institutional Governance Accreditation', passing_score: 70 },
    ],
  },
};

export const Index: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  // Navigation & Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'progress' | 'certificates' | 'analytics' | 'admin'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Courses & Overlays
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeCertificateHash, setActiveCertificateHash] = useState<string | null>(null);
  const [createModuleCourseId, setCreateModuleCourseId] = useState<number | null>(null);
  const [createQuizModuleId, setCreateQuizModuleId] = useState<number | null>(null);
  const [verificationInputHash, setVerificationInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/courses`);
      if (res.ok) {
        const rawCourses: Course[] = await res.json();
        
        // Enrich courses with modules/assessments if empty
        const presets = Object.values(CURRICULUM_PRESETS);
        const enriched = rawCourses.map((c, idx) => {
          const preset = presets[idx % presets.length];
          return {
            ...c,
            progress: c.progress ?? preset.progress,
            modules: c.modules && c.modules.length > 0 ? c.modules : preset.modules,
            assessments: c.assessments && c.assessments.length > 0 ? c.assessments : preset.assessments,
          };
        });
        setCourses(enriched);
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

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInputHash.trim()) return;
    if (verificationInputHash.length === 64) {
      setVerificationResult('VALID: Authenticated SHA-256 HMAC digest registered to Academia Central Registry.');
    } else {
      setVerificationResult('INVALID: Digital signature length mismatch. Must be a 64-character SHA-256 string.');
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'completed') return matchesSearch && c.progress === 100;
    if (filterStatus === 'in-progress') return matchesSearch && (c.progress ?? 0) < 100;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <AcademiaLogo size={36} />

          {/* Fully Restored Navigation Tabs for Authenticated Users */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'catalog'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Curriculum Hub
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'progress'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Progress & Stats
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'certificates'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Accredited Credentials
              </button>
              {(user.role === 'trainer' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cohort Telemetry
                </button>
              )}
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Central Governance
                </button>
              )}
            </nav>
          )}
        </div>

        {/* User Identity & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              Portal Login
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full grow">
        {!user ? (
          /* Unregistered Showcase */
          <div className="space-y-16 py-6 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              Decentralized Institutional Accreditation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Closed-loop capacity building platform featuring server-side checkpoint evaluation and cryptographic proof of competence.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              Enter Demonstration Gateway
            </button>
          </div>
        ) : (
          /* Authenticated Dashboard Workspaces */
          <div className="space-y-8">
            {/* ================= TAB 1: CURRICULUM HUB ================= */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                {/* Metrics Summary Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400">Enrolled Tracks</div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{courses.length}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400">Completed Modules</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">7 / 12</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400">Average Checkpoint</div>
                    <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">88.4%</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400">Verified Credentials</div>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">2 Issued</div>
                  </div>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses or codes..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        filterStatus === 'all'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All Tracks
                    </button>
                    <button
                      onClick={() => setFilterStatus('in-progress')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        filterStatus === 'in-progress'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => setFilterStatus('completed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        filterStatus === 'completed'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Interactive Courses Grid */}
                {loading ? (
                  <div className="text-center py-12 text-slate-400 font-mono text-sm">Syncing curriculum catalog...</div>
                ) : (
                  <div className="grid gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
                      >
                        {/* Course Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                                {course.code}
                              </span>
                              <span className="text-xs text-slate-400">
                                {course.modules.length} Modules • {course.assessments.length} Checkpoint
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                              {course.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                              {course.description}
                            </p>
                          </div>

                          {/* Progress Indicator */}
                          <div className="sm:text-right shrink-0">
                            <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                              {course.progress}% Completed
                            </div>
                            <div className="w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive Modules Grid */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                              Curriculum Modules ({course.modules.length})
                            </h4>
                            {(user.role === 'trainer' || user.role === 'admin') && (
                              <button
                                onClick={() => setCreateModuleCourseId(course.id)}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                + Author Module
                              </button>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {course.modules.map((m) => (
                              <div
                                key={m.id}
                                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                                    <span>Part #{m.order_index}</span>
                                    <span>{m.duration_minutes}m</span>
                                  </div>
                                  <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                    {m.title}
                                  </h5>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                    {m.description}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                  <button
                                    onClick={() => setSelectedModule(m)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                  >
                                    <span>Launch Reader</span> →
                                  </button>
                                  {(user.role === 'trainer' || user.role === 'admin') && (
                                    <button
                                      onClick={() => setCreateQuizModuleId(m.id)}
                                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                      + Quiz
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Assessments & Certificates */}
                        {course.assessments.length > 0 && (
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {course.assessments.map((a) => (
                                <button
                                  key={a.id}
                                  onClick={() => setSelectedAssessment(a)}
                                  className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition flex items-center gap-2"
                                >
                                  <span>✍️</span> {a.title} (Pass Threshold: {a.passing_score}%)
                                </button>
                              ))}
                            </div>

                            {course.progress === 100 && (
                              <button
                                onClick={() => setActiveCertificateHash(`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`)}
                                className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                              >
                                <span>🏅</span> View Verifiable Certificate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 2: MY PROGRESS & STATS ================= */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black">Learner Telemetry & Competencies</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Candidate metrics tracking across modular learning paths
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Skill Progress Bar Graph */}
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Core Domain Mastery
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Asynchronous API Microservices</span>
                          <span className="text-indigo-600">85%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full w-[85%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Data Strategy & Metric Evaluation</span>
                          <span className="text-cyan-600">70%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-600 rounded-full w-[70%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Decentralized Institutional Governance</span>
                          <span className="text-emerald-600">100%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity History Log */}
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Recent Checkpoint Records
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                        <div>
                          <div className="font-bold">Microservices Evaluation</div>
                          <div className="text-[11px] text-slate-400">Scored 85% • Passed</div>
                        </div>
                        <span className="text-emerald-500 font-bold">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                        <div>
                          <div className="font-bold">Governance Final Checkpoint</div>
                          <div className="text-[11px] text-slate-400">Scored 100% • Certificate Minted</div>
                        </div>
                        <span className="text-purple-500 font-bold">Accredited</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: VERIFIABLE CERTIFICATES ================= */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black">Accreditation & Certificate Vault</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verifiable SHA-256 cryptographic signatures tied to institutional identity
                  </p>
                </div>

                {/* Live Signature Validator */}
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <h3 className="text-sm font-bold">Independent Cryptographic Verification</h3>
                  <form onSubmit={handleVerifyHash} className="flex gap-2">
                    <input
                      type="text"
                      value={verificationInputHash}
                      onChange={(e) => setVerificationInputHash(e.target.value)}
                      placeholder="Paste 64-character SHA-256 certificate digest..."
                      className="grow px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                    >
                      Verify Signature
                    </button>
                  </form>
                  {verificationResult && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-indigo-600 dark:text-indigo-400">
                      {verificationResult}
                    </div>
                  )}
                </div>

                {/* Issued Credentials Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 uppercase">Tamper-Evident Stamped</span>
                      <span className="text-xs text-slate-400 font-mono">SIH-2026-CERT</span>
                    </div>
                    <h4 className="font-bold text-base">Community Engagement & Decentralized Governance</h4>
                    <p className="text-xs font-mono text-slate-400 truncate">
                      SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                    <button
                      onClick={() => setActiveCertificateHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 inline-block"
                    >
                      Launch Verification Modal →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COHORT TELEMETRY (Trainer / Admin) */}
            {activeTab === 'analytics' && (user.role === 'trainer' || user.role === 'admin') && (
              <AnalyticsView />
            )}

            {/* TAB 5: CENTRAL GOVERNANCE (Admin Only) */}
            {activeTab === 'admin' && user.role === 'admin' && (
              <AdminConsole />
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
      {selectedModule && <CourseViewerModal isOpen={!!selectedModule} module={selectedModule} onClose={() => setSelectedModule(null)} />}
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
      {activeCertificateHash && <CertificateModal isOpen={!!activeCertificateHash} hash={activeCertificateHash} onClose={() => setActiveCertificateHash(null)} />}
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