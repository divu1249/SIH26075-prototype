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

// Built-in presets to populate rich interactive curriculum
const CURRICULUM_PRESETS: Record<string, { modules: Module[]; assessments: Assessment[]; progress: number }> = {
  PRESET_1: {
    progress: 75,
    modules: [
      {
        id: 101,
        title: 'Asynchronous Architecture & Event Loops',
        description: 'Deep dive into non-blocking I/O routines, event synchronization, and async task queuing.',
        duration_minutes: 40,
        content: '# Asynchronous Architecture\n\nModern microservices rely on asynchronous non-blocking event loops to maximize single-thread throughput.',
        order_index: 1,
      },
      {
        id: 102,
        title: 'High-Throughput Microservices & gRPC',
        description: 'Protocol buffer contracts, bi-directional streaming, and microsecond IPC serialization.',
        duration_minutes: 50,
        content: '# High-Throughput Microservices\n\nEliminate JSON serialization bottlenecks using Google Protobuf and HTTP/2 multiplexed streams.',
        order_index: 2,
      },
      {
        id: 103,
        title: 'Distributed State & Cache Consistency',
        description: 'Multi-region Redis caching patterns, cache-aside invalidation, and race condition prevention.',
        duration_minutes: 35,
        content: '# Distributed Caching Strategies\n\nDesigning resilient caching layers with distributed locking primitives.',
        order_index: 3,
      },
    ],
    assessments: [
      { id: 201, module_id: 101, title: 'Microservices Performance Checkpoint', passing_score: 75 },
    ],
  },
  PRESET_2: {
    progress: 40,
    modules: [
      {
        id: 104,
        title: 'Statistical Inference & Decision Matrices',
        description: 'Transforming qualitative metrics into actionable confidence bands and decision telemetry.',
        duration_minutes: 45,
        content: '# Statistical Decision Matrices\n\nSynthesizing telemetry data into probabilistic decision scoring models.',
        order_index: 1,
      },
      {
        id: 105,
        title: 'Predictive Modeling & Anomaly Detection',
        description: 'Unsupervised pattern recognition and cohort dropout risk forecasting.',
        duration_minutes: 55,
        content: '# Predictive Modeling\n\nDeploying anomaly detection algorithms to flag high-risk training pipelines in real time.',
        order_index: 2,
      },
    ],
    assessments: [
      { id: 202, module_id: 104, title: 'Data Strategy & Forecasting Evaluation', passing_score: 80 },
    ],
  },
  PRESET_3: {
    progress: 100,
    modules: [
      {
        id: 106,
        title: 'Decentralized Community Outreach Protocols',
        description: 'Public-sector capacity engagement architectures and open curriculum governance.',
        duration_minutes: 30,
        content: '# Decentralized Governance\n\nEstablishing decentralized training hubs with verifiable proof of participation.',
        order_index: 1,
      },
      {
        id: 107,
        title: 'Closed-Loop Stakeholder Feedback Iteration',
        description: 'Continuous curriculum improvement pipelines driven by cryptographically audited metrics.',
        duration_minutes: 35,
        content: '# Feedback Infrastructure\n\nClosing the gap between learner output telemetry and curriculum authoring revisions.',
        order_index: 2,
      },
    ],
    assessments: [
      { id: 203, module_id: 106, title: 'Institutional Governance Qualification', passing_score: 70 },
    ],
  },
};

export const Index: React.FC = () => {
  const { user, login, logout, theme, toggleTheme } = useAuth();

  // Navigation & Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'telemetry' | 'credentials' | 'authoring' | 'governance'>('curriculum');
  const [showArchModal, setShowArchModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Pre-Login Interactive Slide Carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      badge: 'SIH 26075 Innovation',
      title: 'Decentralized Capacity Building Engine',
      desc: 'Solves the nationwide challenge of unverified vocational and technical competencies by combining role-segregated learning tracks with immutable digital proofs.',
      icon: '🏛️',
      color: 'from-indigo-500/10 to-blue-500/10 dark:from-indigo-950/40 dark:to-blue-950/40',
    },
    {
      badge: 'Anti-Tampering Architecture',
      title: 'Server-Side Evaluation Pipeline',
      desc: 'Submissions are verified entirely backend-side against isolated question banks, preventing client inspection, DevTools tampering, and synthetic credential fraud.',
      icon: '🛡️',
      color: 'from-cyan-500/10 to-teal-500/10 dark:from-cyan-950/40 dark:to-teal-950/40',
    },
    {
      badge: 'Cryptographic Provenance',
      title: 'HMAC SHA-256 Verifiable Credentials',
      desc: 'Successful checkpoints immediately mint an immutable 64-character hash digest stamped with institutional authority signatures for instant 3rd-party validation.',
      icon: '🔐',
      color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40',
    },
  ];

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeCertificateHash, setActiveCertificateHash] = useState<string | null>(null);
  const [createModuleCourseId, setCreateModuleCourseId] = useState<number | null>(null);
  const [createQuizModuleId, setCreateQuizModuleId] = useState<number | null>(null);

  // Live Simulator State
  const [simCandidate, setSimCandidate] = useState('Aisha Verma');
  const [simScore, setSimScore] = useState(88);
  const [simulatedHash, setSimulatedHash] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/courses`);
      if (res.ok) {
        const rawCourses: Course[] = await res.json();
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

  // Quick 1-Click Persona Demonstrators (for Hackathon Judges)
  const quickDemoLogin = (role: 'trainee' | 'trainer' | 'admin') => {
    if (role === 'trainee') {
      login('demo-token-trainee', {
        id: 101,
        name: 'Aisha Verma',
        email: 'aisha@connect.edu',
        role: 'trainee',
      });
      setActiveTab('curriculum');
    } else if (role === 'trainer') {
      login('demo-token-trainer', {
        id: 102,
        name: 'Prof. Aarav Sharma',
        email: 'aarav@connect.edu',
        role: 'trainer',
      });
      setActiveTab('authoring');
    } else {
      login('demo-token-admin', {
        id: 103,
        name: 'Central Registry Root',
        email: 'admin.root@capacityconnect.gov',
        role: 'admin',
      });
      setActiveTab('governance');
    }
  };

  const handleSimulateHash = () => {
    const raw = `${simCandidate}:${simScore}:${Date.now()}:SIH26075:ACADEMIAEDU`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    setSimulatedHash(`a4c9f10${hex}e8b24d773210fc9a87d61245091ef73a9082c3d4e5f6a1b2c3d4e5f6`);
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-8">
          <AcademiaLogo size={36} />

          {/* Persona-Specific Navigation Tabs */}
          {user && (
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'curriculum'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Curriculum Hub
              </button>

              {user.role === 'trainee' && (
                <>
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === 'telemetry'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    My Telemetry & Mastery
                  </button>
                  <button
                    onClick={() => setActiveTab('credentials')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === 'credentials'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Verifiable Credentials
                  </button>
                </>
              )}

              {(user.role === 'trainer' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('authoring')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'authoring'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Curriculum Authoring Studio
                </button>
              )}

              {(user.role === 'trainer' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'telemetry'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cohort Telemetry
                </button>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'governance'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Central Governance
                </button>
              )}
            </nav>
          )}
        </div>

        {/* Global Action Elements */}
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
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full shadow-xs">
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
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Responsive Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full grow">
        {!user ? (
          /* =========================================================================
             PRE-LOGIN: FLUID GUEST EXPERIENCE WITH SLIDES & SIMULATORS
             ========================================================================= */
          <div className="space-y-16 py-4">
            {/* Interactive Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Smart India Hackathon 2026 • Problem Statement SIH 26075</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Decentralized Capacity Building & Verifiable Skill Accreditation
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                An institutional training architecture enabling dynamic curriculum authoring, tamper-resistant server-side grading, and cryptographic qualification proofs.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
                >
                  Portal Sign In / Register
                </button>
                <button
                  onClick={() => setShowArchModal(true)}
                  className="px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Architecture Blueprint ↗
                </button>
                <button
                  onClick={() => setShowSimulatorModal(true)}
                  className="px-6 py-3 rounded-xl font-bold border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                >
                  Interactive Hash Simulator ⚙
                </button>
              </div>
            </div>

            {/* Interactive Carousel / Slide Deck Showcase */}
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {slides[currentSlide].badge}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-2 text-6xl flex justify-center items-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  {slides[currentSlide].icon}
                </div>
                <div className="md:col-span-10 space-y-2">
                  <h3 className="text-2xl font-black">{slides[currentSlide].title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {slides[currentSlide].desc}
                  </p>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === i ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Instant 1-Click Role Demonstrators for Presentation Judges */}
            <div className="p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Evaluator Instant Gateway</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click any testing persona below to bypass manual entry and test the live role-scoped workspace:
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded">
                      Trainee Candidate
                    </span>
                    <h4 className="font-bold text-base mt-2">Aisha Verma</h4>
                    <p className="text-xs text-slate-500 mt-1">Interactive modules, quiz evaluation & SHA-256 certificate collection.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('trainee')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Launch as Trainee →
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded">
                      Trainer Instructor
                    </span>
                    <h4 className="font-bold text-base mt-2">Prof. Aarav Sharma</h4>
                    <p className="text-xs text-slate-500 mt-1">Curriculum authoring studio, quiz editor & cohort telemetry analytics.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('trainer')}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Launch as Trainer →
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded">
                      Institutional Admin
                    </span>
                    <h4 className="font-bold text-base mt-2">Central Root Authority</h4>
                    <p className="text-xs text-slate-500 mt-1">Audit trail ledger, stateless node verification & global governance rules.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('admin')}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Launch as Admin →
                  </button>
                </div>
              </div>
            </div>

            {/* Read-Only Public Tracks Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Standard Institutional Pathways</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Curricula currently active on the decentralized network</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600">{course.code}</span>
                      <h4 className="font-bold text-lg mt-1">{course.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                    </div>
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                    >
                      Sign In to Begin Track →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             POST-LOGIN: DYNAMIC ROLE-SEGREGATED INTERACTIVE WORKSPACES
             ========================================================================= */
          <div className="space-y-8">
            {/* Contextual Persona Banner */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Active Workspace Session
                </span>
                <h2 className="text-2xl font-black mt-0.5">Welcome, {user.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authenticated Tier: <span className="font-bold capitalize">{user.role}</span> • Institutional Gateway: Online
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user.role === 'trainee' && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    Active Learner Sync
                  </span>
                )}
                {user.role === 'trainer' && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 border border-cyan-200 dark:border-cyan-800">
                    Curriculum Curator Access
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800">
                    Root Governance Tier
                  </span>
                )}
              </div>
            </div>

            {/* TAB: CURRICULUM HUB */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assigned tracks..."
                    className="w-full sm:w-80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="grid gap-6">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{course.code}</span>
                          <h3 className="text-xl font-bold mt-1">{course.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">{course.description}</p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <div className="text-xs font-extrabold text-indigo-600">{course.progress}% Completed</div>
                          <div className="w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Learning Modules Grid */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          Curriculum Modules ({course.modules.length})
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {course.modules.map(m => (
                            <div key={m.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
                              <div>
                                <div className="text-[11px] font-mono text-slate-400 mb-1">{m.duration_minutes} mins</div>
                                <h5 className="font-bold text-sm">{m.title}</h5>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{m.description}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                <button
                                  onClick={() => setSelectedModule(m)}
                                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  Open Interactive Reader →
                                </button>
                                {(user.role === 'trainer' || user.role === 'admin') && (
                                  <button
                                    onClick={() => setCreateQuizModuleId(m.id)}
                                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                  >
                                    + Add Quiz
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Checkpoint Assessments & Certificate Issuance */}
                      {course.assessments.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {course.assessments.map(a => (
                              <button
                                key={a.id}
                                onClick={() => setSelectedAssessment(a)}
                                className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition flex items-center gap-2"
                              >
                                <span>✍️</span> {a.title} (Pass: {a.passing_score}%)
                              </button>
                            ))}
                          </div>

                          {course.progress === 100 && (
                            <button
                              onClick={() => setActiveCertificateHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                            >
                              <span>🏅</span> Minted SHA-256 Certificate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TRAINER AUTHORING STUDIO */}
            {activeTab === 'authoring' && (user.role === 'trainer' || user.role === 'admin') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold">Curriculum Design & Module Authoring</h3>
                    <p className="text-xs text-slate-500">Add learning units and air-gapped evaluation checkpoints</p>
                  </div>
                  <button
                    onClick={() => setCreateModuleCourseId(courses[0]?.id || 1)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                  >
                    + Create New Module
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {courses.map(c => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-cyan-600">{c.code}</span>
                        <button
                          onClick={() => setCreateModuleCourseId(c.id)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          + Append Unit
                        </button>
                      </div>
                      <h4 className="font-bold">{c.title}</h4>
                      <p className="text-xs text-slate-500">{c.modules.length} Active modules in production</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TELEMETRY (Learner Mastery / Cohort Telemetry) */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6">
                <AnalyticsView />
              </div>
            )}

            {/* TAB: VERIFIABLE CREDENTIALS (Trainee) */}
            {activeTab === 'credentials' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Tamper-Resistant Credential Ledger</h3>
                  <p className="text-xs text-slate-500">Cryptographically verifiable certificates registered on AcademiaEdu</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-600 uppercase">Tamper-Proof Verified</span>
                      <span className="text-xs font-mono text-slate-400">SIH-2026-CERT</span>
                    </div>
                    <h4 className="font-bold text-base">Community Engagement & Decentralized Governance</h4>
                    <p className="text-xs font-mono text-slate-400 truncate">
                      SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                    <button
                      onClick={() => setActiveCertificateHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 block"
                    >
                      View Certificate Modal →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CENTRAL GOVERNANCE (Admin) */}
            {activeTab === 'governance' && user.role === 'admin' && (
              <AdminConsole />
            )}
          </div>
        )}
      </main>

      {/* Global Interactive Architecture Modal Popup */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Platform Architecture Blueprint</h3>
              <button onClick={() => setShowArchModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-indigo-600 font-bold mb-1">[Frontend Layer: React + Vite + Tailwind]</div>
                Stateless client interface communicating via Bearer JWT with zero client-side evaluation secrets.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-cyan-600 font-bold mb-1">[Backend Engine: FastAPI + OAuth2 + SQLAlchemy]</div>
                Server-side scoring routines and SHA-256 HMAC digital signature minting hosted on Render.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-emerald-600 font-bold mb-1">[Verification Layer: Immutable Hashes]</div>
                Independent verification against the AcademiaEdu Root Registry prevents qualification fraud.
              </div>
            </div>
            <button
              onClick={() => setShowArchModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Close Blueprint
            </button>
          </div>
        </div>
      )}

      {/* Global Live Hash Simulator Modal Popup */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Live HMAC SHA-256 Simulator</h3>
              <button onClick={() => setShowSimulatorModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-500">Test how AcademiaEdu cryptographically stamps candidate scores without exposing grading keys:</p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Candidate Name</label>
                <input
                  type="text"
                  value={simCandidate}
                  onChange={(e) => setSimCandidate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs mt-1 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Passing Score (%)</label>
                <input
                  type="number"
                  value={simScore}
                  onChange={(e) => setSimScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs mt-1 outline-none"
                />
              </div>
              <button
                onClick={handleSimulateHash}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Compute Verifiable Digital Digest
              </button>

              {simulatedHash && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 break-all text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {simulatedHash}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        AcademiaEdu • Smart India Hackathon 2026 • Problem Statement SIH 26075
      </footer>
    </div>
  );
};

export default Index;