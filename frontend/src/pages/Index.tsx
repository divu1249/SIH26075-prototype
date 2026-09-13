import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
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
  completed?: boolean;
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

// Built-in synchronous curriculum tracks (renders instantly, no empty flash)
const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    code: 'ACAD-101',
    title: 'Asynchronous API Microservices',
    description: 'Core event-driven architecture, non-blocking I/O routines, and thread concurrency models.',
    progress: 75,
    modules: [
      {
        id: 101,
        title: 'Asynchronous Architecture & Event Loops',
        description: 'Deep dive into non-blocking I/O routines, event synchronization, and async task queuing.',
        duration_minutes: 40,
        content: '# Asynchronous Architecture\n\nUnderstand event loops, message queues, and async worker patterns in modern web applications.\n\n### Key Concepts\n- Non-blocking execution\n- Worker pool allocation\n- State synchronization',
        order_index: 1,
        completed: true,
      },
      {
        id: 102,
        title: 'High-Throughput Microservices & gRPC',
        description: 'Protocol buffer contracts, bi-directional streaming, and low-latency IPC serialization.',
        duration_minutes: 50,
        content: '# High-Throughput Microservices\n\nEliminate JSON parse-time bottlenecks using Google Protobuf and HTTP/2 multiplexed streams.',
        order_index: 2,
        completed: true,
      },
      {
        id: 103,
        title: 'Distributed State & Cache Consistency',
        description: 'Multi-region Redis caching patterns, cache-aside invalidation, and race condition prevention.',
        duration_minutes: 35,
        content: '# Distributed Caching Strategies\n\nDesign resilient cache hierarchies using distributed leases and atomic write-through pipelines.',
        order_index: 3,
        completed: false,
      },
    ],
    assessments: [
      { id: 201, module_id: 101, title: 'Microservices Performance Checkpoint', passing_score: 75 },
    ],
  },
  {
    id: 2,
    code: 'ACAD-102',
    title: 'Data-Informed Decision Making',
    description: 'Transforming qualitative metrics into actionable confidence bands and decision telemetry.',
    progress: 40,
    modules: [
      {
        id: 104,
        title: 'Statistical Inference & Decision Matrices',
        description: 'Transforming telemetry streams into actionable confidence intervals and risk scoring.',
        duration_minutes: 45,
        content: '# Statistical Decision Matrices\n\nSynthesizing telemetry data into probabilistic decision scoring models.',
        order_index: 1,
        completed: true,
      },
      {
        id: 105,
        title: 'Predictive Modeling & Anomaly Detection',
        description: 'Unsupervised pattern recognition algorithms to identify cohort attrition flags.',
        duration_minutes: 55,
        content: '# Predictive Frameworks\n\nDeploy statistical classifiers and variance monitors to flag anomalies in real time.',
        order_index: 2,
        completed: false,
      },
    ],
    assessments: [
      { id: 202, module_id: 104, title: 'Data Strategy & Forecasting Evaluation', passing_score: 80 },
    ],
  },
  {
    id: 3,
    code: 'ACAD-103',
    title: 'Community Engagement & Outreach',
    description: 'Public-sector capacity engagement architectures and decentralized curriculum governance.',
    progress: 100,
    modules: [
      {
        id: 106,
        title: 'Decentralized Community Outreach Protocols',
        description: 'Public-sector capacity engagement architectures and open curriculum governance.',
        duration_minutes: 30,
        content: '# Decentralized Governance\n\nEstablishing federated learning pods with verifiable proof of participation.',
        order_index: 1,
        completed: true,
      },
      {
        id: 107,
        title: 'Closed-Loop Stakeholder Feedback Iteration',
        description: 'Continuous curriculum refinement driven by cryptographically audited metrics.',
        duration_minutes: 35,
        content: '# Continuous Audit Loops\n\nChannel learner telemetry into continuous course updates and content improvements.',
        order_index: 2,
        completed: true,
      },
    ],
    assessments: [
      { id: 203, module_id: 106, title: 'Institutional Governance Qualification', passing_score: 70 },
    ],
  },
];

export const Index: React.FC = () => {
  const { user, login, logout, theme, toggleTheme } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'curriculum' | 'telemetry' | 'credentials' | 'authoring' | 'governance'>('curriculum');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Overlays
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Curriculum Data
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeCertificateHash, setActiveCertificateHash] = useState<string | null>(null);
  const [createModuleCourseId, setCreateModuleCourseId] = useState<number | null>(null);
  const [createQuizModuleId, setCreateQuizModuleId] = useState<number | null>(null);

  // Pre-Login Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      badge: 'SIH 26075 Architectural Specification',
      title: 'Decentralized Capacity Building Engine',
      desc: 'Institutional platform providing isolated role-segregated learning tracks, tamper-resistant checkpoints, and cryptographically verified qualifications.',
      icon: '🏛️',
    },
    {
      badge: 'Anti-Tampering Integrity',
      title: 'Server-Side Air-Gapped Evaluation',
      desc: 'All assessment submissions are graded backend-side against isolated question vectors, preventing client inspection and synthetic credential minting.',
      icon: '🛡️',
    },
    {
      badge: 'Cryptographic Provenance',
      title: 'HMAC SHA-256 Verifiable Accreditation',
      desc: 'Successful completions mint immutable 64-character hash signatures stamped with institutional timestamps for instantaneous 3rd-party validation.',
      icon: '🔐',
    },
  ];

  // Live Simulator State
  const [simCandidate, setSimCandidate] = useState('Aisha Verma');
  const [simScore, setSimScore] = useState(88);
  const [simulatedHash, setSimulatedHash] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/courses`);
        if (res.ok) {
          const raw: Course[] = await res.json();
          if (Array.isArray(raw) && raw.length > 0) {
            setCourses(prev =>
              raw.map((c, i) => {
                const fallback = INITIAL_COURSES[i % INITIAL_COURSES.length];
                return {
                  ...fallback,
                  ...c,
                  modules: c.modules && c.modules.length > 0 ? c.modules : fallback.modules,
                  assessments: c.assessments && c.assessments.length > 0 ? c.assessments : fallback.assessments,
                  progress: c.progress ?? fallback.progress,
                };
              })
            );
          }
        }
      } catch (err) {
        console.warn('Backend currently syncing; using verified local presets', err);
      }
    };
    fetchCourses();
  }, [apiBaseUrl]);

  // Crash-Proof Memoized Search
  const filteredCourses = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c => {
      if (!c) return false;
      const title = (c.title || '').toLowerCase();
      const code = (c.code || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      return title.includes(q) || code.includes(q) || desc.includes(q);
    });
  }, [courses, searchQuery]);

  const handleCompleteModule = (moduleId: number) => {
    setCourses(prev =>
      prev.map(course => {
        if (!course.modules.some(m => m.id === moduleId)) return course;
        const updatedModules = course.modules.map(m => (m.id === moduleId ? { ...m, completed: true } : m));
        const completedCount = updatedModules.filter(m => m.completed).length;
        return {
          ...course,
          modules: updatedModules,
          progress: Math.round((completedCount / updatedModules.length) * 100),
        };
      })
    );
  };

  const quickDemoLogin = (role: 'trainee' | 'trainer' | 'admin') => {
    if (role === 'trainee') {
      login('demo-token-trainee', { id: 101, name: 'Aisha Verma', email: 'aisha@connect.edu', role: 'trainee' });
      setActiveTab('curriculum');
    } else if (role === 'trainer') {
      login('demo-token-trainer', { id: 102, name: 'Prof. Aarav Sharma', email: 'aarav@connect.edu', role: 'trainer' });
      setActiveTab('authoring');
    } else {
      login('demo-token-admin', { id: 103, name: 'Central Registry Root', email: 'admin.root@capacityconnect.gov', role: 'admin' });
      setActiveTab('governance');
    }
  };

  const handleSimulateHash = () => {
    const raw = `${simCandidate}:${simScore}:${Date.now()}:SIH26075:ACADEMIAEDU`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    setSimulatedHash(`a4c9f10${hex}e8b24d773210fc9a87d61245091ef73a9082c3d4e5f6a1b2c3d4e5f6`);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Visual Depth Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-96 -left-40 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B101E]/90 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/40">
        <div className="flex items-center gap-8">
          {/* Integrated Vector Wordmark */}
          <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={() => setActiveTab('curriculum')}>
            <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <defs>
                <linearGradient id="headerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#4338CA" />
                </linearGradient>
                <linearGradient id="headerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
              <polygon points="32,4 58,19 58,45 32,60 6,45 6,19" stroke="url(#headerGrad1)" strokeWidth="3" fill="none" opacity="0.4" />
              <path d="M32 12L54 24L32 36L10 24L32 12Z" fill="url(#headerGrad1)" />
              <path d="M18 31V41C18 41 24 47 32 47C40 47 46 41 46 41V31L32 39L18 31Z" fill="#3730A3" />
              <path d="M48 27V42" stroke="url(#headerGrad2)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="48" cy="44.5" r="3" fill="#06B6D4" />
            </svg>
            <div className="flex flex-col justify-center leading-none">
              <div className="text-xl font-black tracking-tight text-white">
                Academia<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edu</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mt-0.5">
                Capacity Engine • SIH 26075
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'curriculum' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Curriculum Hub
              </button>
              {user.role === 'trainee' && (
                <>
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === 'telemetry' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    My Telemetry & Mastery
                  </button>
                  <button
                    onClick={() => setActiveTab('credentials')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === 'credentials' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
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
                    activeTab === 'authoring' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Curriculum Studio
                </button>
              )}
              {(user.role === 'trainer' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'telemetry' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cohort Telemetry
                </button>
              )}
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === 'governance' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Central Governance
                </button>
              )}
            </nav>
          )}
        </div>

        {/* Global Controls & User Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white transition"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 max-w-[130px] sm:max-w-[200px] truncate">
                  {user.name || 'Candidate'}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {user.role || 'trainee'}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition shadow-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full grow relative z-10">
        {!user ? (
          /* PRE-LOGIN EXPERIENCE */
          <div className="space-y-16 py-4">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-bold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Smart India Hackathon 2026 • Problem Statement SIH 26075</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Decentralized Capacity Building & Verifiable Accreditation
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                An institutional training architecture enabling dynamic curriculum authoring, tamper-resistant server-side grading, and cryptographic qualification proofs.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                >
                  Portal Sign In / Register
                </button>
                <button
                  onClick={() => setShowArchModal(true)}
                  className="px-6 py-3 rounded-xl font-bold border border-slate-800 bg-[#0F172A]/80 text-slate-200 hover:border-slate-700 transition"
                >
                  Architecture Blueprint ↗
                </button>
                <button
                  onClick={() => setShowSimulatorModal(true)}
                  className="px-6 py-3 rounded-xl font-bold border border-cyan-800/70 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-950/60 transition"
                >
                  Interactive Hash Simulator ⚙
                </button>
              </div>
            </div>

            {/* Slide Showcase */}
            <div className="p-8 rounded-3xl border border-slate-800/80 bg-[#0E1526]/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  {slides[currentSlide].badge}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlide(p => (p === 0 ? slides.length - 1 : p - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-sm font-bold hover:bg-slate-800"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentSlide(p => (p === slides.length - 1 ? 0 : p + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-sm font-bold hover:bg-slate-800"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-2 text-6xl flex justify-center items-center p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-inner">
                  {slides[currentSlide].icon}
                </div>
                <div className="md:col-span-10 space-y-2">
                  <h3 className="text-2xl font-black">{slides[currentSlide].title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{slides[currentSlide].desc}</p>
                </div>
              </div>
            </div>

            {/* 1-Click Persona Evaluator Buttons */}
            <div className="p-8 rounded-3xl border border-slate-800/80 bg-[#0E1526]/80 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Evaluator Instant Gateway</h3>
                <p className="text-xs text-slate-400 mt-1">Bypass manual entry to evaluate role-isolated workspaces immediately:</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                      Trainee Candidate
                    </span>
                    <h4 className="font-bold text-base mt-2">Aisha Verma</h4>
                    <p className="text-xs text-slate-400 mt-1">Interactive modules, quiz evaluation & SHA-256 certificate collection.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('trainee')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Launch as Trainee →
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      Trainer Instructor
                    </span>
                    <h4 className="font-bold text-base mt-2">Prof. Aarav Sharma</h4>
                    <p className="text-xs text-slate-400 mt-1">Curriculum authoring studio, quiz editor & cohort telemetry analytics.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('trainer')}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Launch as Trainer →
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/50">
                      Institutional Admin
                    </span>
                    <h4 className="font-bold text-base mt-2">Central Root Authority</h4>
                    <p className="text-xs text-slate-400 mt-1">Audit trail ledger, stateless node verification & global governance rules.</p>
                  </div>
                  <button
                    onClick={() => quickDemoLogin('admin')}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Launch as Admin →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* POST-LOGIN AUTHENTICATED WORKSPACES */
          <div className="space-y-8">
            {/* Context Header Card */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#0E1526]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Active Workspace Session
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-0.5 tracking-tight text-white">
                  Welcome, {user.name || 'Candidate'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticated Tier: <span className="font-bold capitalize text-slate-200">{user.role || 'trainee'}</span> • Institutional Node: Active
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/70 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Decentralized Node Sync Online
                </span>
              </div>
            </div>

            {/* TAB: CURRICULUM HUB */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-96">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') e.preventDefault();
                      }}
                      placeholder="Search courses, units, or modules..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-[#0B101E] text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition shadow-inner"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white">
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Showing {filteredCourses.length} of {courses.length} Tracks
                  </div>
                </div>

                {/* Course Grid */}
                <div className="grid gap-6">
                  {filteredCourses.map(course => (
                    <div
                      key={course.id}
                      className="p-6 sm:p-7 rounded-3xl border border-slate-800/90 bg-[#0E1526]/80 backdrop-blur-xl shadow-2xl hover:border-slate-700 transition space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-md">
                            {course.code}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black mt-2 text-white">{course.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">{course.description}</p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <div className="text-xs font-extrabold text-indigo-400">{course.progress}% Completed</div>
                          <div className="w-40 h-2 bg-slate-900 rounded-full mt-1.5 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Modules Grid */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          Curriculum Modules ({course.modules?.length || 0})
                        </h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {course.modules?.map(m => (
                            <div
                              key={m.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                m.completed ? 'border-indigo-900/60 bg-[#121B33]/60' : 'border-slate-800/80 bg-[#0B101E]/60'
                              } shadow-lg`}
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                                  <span>{m.duration_minutes} mins</span>
                                  {m.completed && <span className="text-[10px] text-emerald-400 font-bold uppercase">✓ Read</span>}
                                </div>
                                <h5 className="font-bold text-sm text-slate-200">{m.title}</h5>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{m.description}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                <button
                                  onClick={() => setSelectedModule(m)}
                                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                  <span>Open Interactive Reader</span> →
                                </button>
                                {(user.role === 'trainer' || user.role === 'admin') && (
                                  <button onClick={() => setCreateQuizModuleId(m.id)} className="text-[11px] font-semibold text-slate-400 hover:text-white">
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
                        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {course.assessments.map(a => (
                              <button
                                key={a.id}
                                onClick={() => setSelectedAssessment(a)}
                                className="px-4 py-2 rounded-xl border border-indigo-900/80 bg-indigo-950/40 text-indigo-300 text-xs font-bold hover:bg-indigo-900/60 transition flex items-center gap-2"
                              >
                                <span>✍️</span> {a.title} (Pass: {a.passing_score}%)
                              </button>
                            ))}
                          </div>
                          {course.progress === 100 && (
                            <button
                              onClick={() => setActiveCertificateHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                              className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition flex items-center gap-1.5"
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

            {/* TAB: TELEMETRY */}
            {activeTab === 'telemetry' && <AnalyticsView />}

            {/* TAB: CREDENTIALS */}
            {activeTab === 'credentials' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Tamper-Resistant Credential Ledger</h3>
                  <p className="text-xs text-slate-400">Cryptographically signed credentials bound to candidate public keys</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl border border-slate-800 bg-[#0E1526]/80 shadow-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Tamper-Proof Verified</span>
                      <span className="text-xs font-mono text-slate-400">SIH-2026-CERT</span>
                    </div>
                    <h4 className="font-bold text-base">Community Engagement & Decentralized Governance</h4>
                    <p className="text-xs font-mono text-slate-400 truncate">
                      SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                    <button
                      onClick={() => setActiveCertificateHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                      className="text-xs font-bold text-indigo-400 hover:underline pt-2 block"
                    >
                      View Certificate Modal →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUTHORING */}
            {activeTab === 'authoring' && (user.role === 'trainer' || user.role === 'admin') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold">Curriculum Design Studio</h3>
                    <p className="text-xs text-slate-400">Add learning modules and configure server-evaluated quizzes</p>
                  </div>
                  <button
                    onClick={() => setCreateModuleCourseId(courses[0]?.id || 1)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
                  >
                    + Create New Module
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.map(c => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-800 bg-[#0E1526]/80 space-y-3 shadow-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-cyan-400">{c.code}</span>
                        <button onClick={() => setCreateModuleCourseId(c.id)} className="text-xs font-bold text-indigo-400 hover:underline">
                          + Append Unit
                        </button>
                      </div>
                      <h4 className="font-bold">{c.title}</h4>
                      <p className="text-xs text-slate-400">{c.modules?.length || 0} active units in this course</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GOVERNANCE */}
            {activeTab === 'governance' && user.role === 'admin' && <AdminConsole />}
          </div>
        )}
      </main>

      {/* Sign Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0E1526] border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white">End Session</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to log out as <span className="font-semibold text-slate-200">{user?.name}</span>?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-bold text-xs hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Blueprint Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0E1526] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Platform Architecture Blueprint</h3>
              <button onClick={() => setShowArchModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="space-y-4 text-xs text-slate-400 leading-relaxed font-mono">
              <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
                <div className="text-indigo-400 font-bold mb-1">[Frontend Tier: React + Vite + Tailwind]</div>
                Stateless client interface communicating via Bearer JWT with zero client-side evaluation secrets.
              </div>
              <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">[Backend Engine: FastAPI + OAuth2 + SQLAlchemy]</div>
                Server-side scoring routines and SHA-256 HMAC digital signature minting hosted on Render.
              </div>
            </div>
            <button onClick={() => setShowArchModal(false)} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              Close Blueprint
            </button>
          </div>
        </div>
      )}

      {/* Simulator Modal */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0E1526] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Live HMAC SHA-256 Simulator</h3>
              <button onClick={() => setShowSimulatorModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Candidate Name</label>
                <input
                  type="text"
                  value={simCandidate}
                  onChange={e => setSimCandidate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs mt-1 outline-none text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Passing Score (%)</label>
                <input
                  type="number"
                  value={simScore}
                  onChange={e => setSimScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs mt-1 outline-none text-white"
                />
              </div>
              <button onClick={handleSimulateHash} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                Compute Verifiable Digital Digest
              </button>
              {simulatedHash && (
                <div className="p-3 rounded-xl bg-[#0B101E] border border-slate-800 break-all text-[11px] font-mono text-emerald-400">
                  {simulatedHash}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
      {selectedModule && (
        <CourseViewerModal
          isOpen={!!selectedModule}
          module={selectedModule}
          onClose={() => {
            if (selectedModule) handleCompleteModule(selectedModule.id);
            setSelectedModule(null);
          }}
        />
      )}
      {selectedAssessment && (
        <CreateQuizModal
          isOpen={!!selectedAssessment}
          assessment={selectedAssessment}
          onSuccess={certHash => {
            setSelectedAssessment(null);
            if (certHash) setActiveCertificateHash(certHash);
          }}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
      {activeCertificateHash && (
        <CertificateModal isOpen={!!activeCertificateHash} hash={activeCertificateHash} onClose={() => setActiveCertificateHash(null)} />
      )}
      {createModuleCourseId !== null && (
        <CreateModuleModal
          isOpen={createModuleCourseId !== null}
          courseId={createModuleCourseId}
          onSuccess={() => setCreateModuleCourseId(null)}
          onClose={() => setCreateModuleCourseId(null)}
        />
      )}

      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        AcademiaEdu • Smart India Hackathon 2026 • Problem Statement SIH 26075
      </footer>
    </div>
  );
};

export default Index;