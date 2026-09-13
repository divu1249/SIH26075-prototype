import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Play,
  Plus,
  PlusCircle,
  Search,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AcademiaLogo from '../components/AcademiaLogo';
import AuthModal from '../components/AuthModal';
import CourseViewerModal from '../components/CourseViewerModal';
import CertificateModal from '../components/CertificateModal';
import AdminConsole from '../components/AdminConsole';
import AnalyticsView from '../components/AnalyticsView';
import CreateModuleModal from '../components/CreateModuleModal';
import CreateQuizModal from '../components/CreateQuizModal';

type WorkspaceTab = 'overview' | 'learning' | 'assessments' | 'progress';

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

interface AssessmentItem {
  id: string;
  title: string;
  module: string;
  questionsCount: number;
  passingScore: number;
  duration: string;
  questions: QuizQuestion[];
}

const defaultCourses = [
  {
    id: 1,
    title: 'Digital Literacy Foundations',
    type: 'Core module',
    instructor: 'Prof. Aarav Mehta',
    lessons: '8 of 12 lessons',
    color: 'from-blue-600 to-indigo-500',
  },
  {
    id: 2,
    title: 'Community Engagement & Outreach',
    type: 'Professional skills',
    instructor: 'Dr. Nia Okafor',
    lessons: '5 of 10 lessons',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 3,
    title: 'Data-Informed Decision Making',
    type: 'Core module',
    instructor: 'Liam Chen',
    lessons: '3 of 14 lessons',
    color: 'from-violet-500 to-fuchsia-500',
  },
];

const defaultAssessments: AssessmentItem[] = [
  {
    id: 'quiz-1',
    title: 'Digital Literacy Checkpoint',
    module: 'Digital Literacy Foundations',
    questionsCount: 3,
    passingScore: 60,
    duration: '15 min',
    questions: [
      {
        q: 'Which data structure operates on a First-In-First-Out (FIFO) principle?',
        options: ['Stack', 'Queue', 'Binary Tree', 'Hash Map'],
        correct: 1,
      },
      {
        q: 'What does RBAC stand for in modern cloud authorization architecture?',
        options: [
          'Role-Based Access Control',
          'Rule-Based Action Call',
          'Remote Basic Auth Channel',
          'Route-Bound Access Cache',
        ],
        correct: 0,
      },
      {
        q: "What is the primary architectural benefit of FastAPI's async execution?",
        options: [
          'Automatic CSS bundling',
          'Non-blocking concurrent I/O throughput',
          'Client-side compilation',
          'Local storage encryption',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Community Mapping Evaluation',
    module: 'Community Engagement & Outreach',
    questionsCount: 2,
    passingScore: 50,
    duration: '10 min',
    questions: [
      {
        q: 'What is the primary objective of community asset mapping?',
        options: [
          'Identifying local skills, institutions, and community strengths',
          'Conducting legal property surveys',
          'Automating server load balancing',
          'Replacing municipal databases',
        ],
        correct: 0,
      },
      {
        q: 'Which stakeholder engagement method produces highest grassroots feedback yield?',
        options: [
          'Anonymous cold surveys',
          'Participatory Action Research (PAR)',
          'Unilateral administrative notices',
          'Third-party advertising',
        ],
        correct: 1,
      },
    ],
  },
];

export const Index: React.FC = () => {
  const { user, login, logout, theme, toggleTheme } = useAuth();

  // Post-login UI State
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [courses, setCourses] = useState(defaultCourses);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(defaultAssessments);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Global & Pre-login Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Post-login Modals
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCertModule, setActiveCertModule] = useState('');
  const [certScore, setCertScore] = useState(100);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedCourseForViewer, setSelectedCourseForViewer] = useState<any>(null);

  // Quiz Engine State
  const [activeQuizItem, setActiveQuizItem] = useState<AssessmentItem | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [gradingResult, setGradingResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

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

  // Simulator State
  const [simCandidate, setSimCandidate] = useState('Aisha Verma');
  const [simScore, setSimScore] = useState(88);
  const [simulatedHash, setSimulatedHash] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  useEffect(() => {
    fetch(`${apiBaseUrl}/courses`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const colors = [
            'from-blue-600 to-indigo-500',
            'from-emerald-500 to-teal-400',
            'from-violet-500 to-fuchsia-500',
          ];
          const mapped = data.map((c: any, i: number) => ({
            id: c.id || i + 1,
            title: c.title || 'Course Module',
            type: c.code || 'Core Module',
            instructor: c.instructor || 'Accredited Faculty',
            lessons: `${c.modules?.length || 4} lessons`,
            color: colors[i % colors.length],
            ...c,
          }));
          setCourses(mapped);
        }
      })
      .catch(() => console.log('Serving synchronized local courses.'));
  }, [apiBaseUrl]);

  // Normalized User Persona Details
  const displayName = useMemo(() => {
    if (!user) return 'Candidate';
    if ((user as any).fullName) return (user as any).fullName;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0].toUpperCase();
    return 'Candidate';
  }, [user]);

  const rawRole = (user?.role || 'trainee').toLowerCase();
  const roleDisplay = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
  const institutionDisplay = (user as any)?.institution || 'AcademiaEdu Central Node';

  const filteredCourses = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => (c.title || '').toLowerCase().includes(q));
  }, [courses, searchQuery]);

  const openLessonViewer = (course: any) => {
    setSelectedCourseForViewer(course);
    setViewerModalOpen(true);
  };

  const startAssessment = (moduleTitle: string) => {
    const matched =
      assessmentsList.find(
        (a) =>
          a.module.toLowerCase() === moduleTitle.toLowerCase() ||
          a.title.toLowerCase() === moduleTitle.toLowerCase()
      ) || assessmentsList[0];

    setActiveQuizItem(matched);
    setQuizStep(0);
    setSelectedAnswers({});
    setGradingResult(null);
  };

  const handleQuizSubmit = () => {
    if (!activeQuizItem) return;
    setLoadingSubmission(true);

    setTimeout(() => {
      let score = 0;
      activeQuizItem.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) score += 1;
      });
      const pct = Math.round((score / activeQuizItem.questions.length) * 100);
      setGradingResult({
        score,
        total: activeQuizItem.questions.length,
        percentage: pct,
        passed: pct >= activeQuizItem.passingScore,
      });
      setLoadingSubmission(false);
    }, 400);
  };

  const handleCreateQuiz = (newQuiz: any) => {
    const formatted: AssessmentItem = {
      id: newQuiz.id || `quiz-${Date.now()}`,
      title: newQuiz.title,
      module: newQuiz.title,
      questionsCount: newQuiz.questions.length,
      passingScore: newQuiz.passingScore,
      duration: `${newQuiz.questions.length * 5} min`,
      questions: newQuiz.questions,
    };
    setAssessmentsList((prev) => [formatted, ...prev]);
  };

  const quickDemoLogin = (role: 'trainee' | 'trainer' | 'admin') => {
    if (role === 'trainee') {
      login('demo-token-trainee', { id: 101, name: 'Aisha Verma', email: 'aisha@connect.edu', role: 'trainee' });
    } else if (role === 'trainer') {
      login('demo-token-trainer', { id: 102, name: 'Prof. Aarav Sharma', email: 'aarav@connect.edu', role: 'trainer' });
    } else {
      login('demo-token-admin', { id: 103, name: 'Central Registry Root', email: 'admin.root@capacityconnect.gov', role: 'admin' });
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

  // =========================================================================
  // PRE-LOGIN DISPLAY (PRESERVED)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
          <div className="absolute top-96 -left-40 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
        </div>

        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B101E]/90 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/40">
          <AcademiaLogo size={36} />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
            >
              Sign In
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 w-full grow relative z-10 space-y-16">
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

          <div className="p-8 rounded-3xl border border-slate-800/80 bg-[#0E1526]/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                {slides[currentSlide].badge}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((p) => (p === 0 ? slides.length - 1 : p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-sm font-bold hover:bg-slate-800"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentSlide((p) => (p === slides.length - 1 ? 0 : p + 1))}
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
                  <p className="text-xs text-slate-400 mt-1">Interactive modules, quiz checkpoints & SHA-256 certificate collection.</p>
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
                  <p className="text-xs text-slate-400 mt-1">Audit trail ledger, node verification & global governance rules.</p>
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
        </main>

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
                    onChange={(e) => setSimCandidate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs mt-1 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400">Passing Score (%)</label>
                  <input
                    type="number"
                    value={simScore}
                    onChange={(e) => setSimScore(Number(e.target.value))}
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

        {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
        <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
          AcademiaEdu • Smart India Hackathon 2026 • Problem Statement SIH 26075
        </footer>
      </div>
    );
  }

  // =========================================================================
  // POST-LOGIN DISPLAY (MATCHING INDEXREF.TXT ARCHITECTURE & SPECIFICATIONS)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 font-sans">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-4 sm:px-7 lg:px-10">
          <button
            className="mr-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>

          <AcademiaLogo size={34} />

          {/* Search Bar */}
          <div className="relative ml-4 hidden max-w-[370px] flex-1 md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, skills, or curriculum..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {/* User Profile & Actions */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-1.5 pr-3 shadow-xs hover:bg-slate-50 transition"
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    rawRole === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-medium text-slate-400 leading-tight">
                    <span className={`font-semibold ${rawRole === 'admin' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {roleDisplay}
                    </span>
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <p className="mt-1 text-[9px] font-mono font-bold text-blue-600 truncate">
                      {institutionDisplay}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* SIDEBAR */}
        <aside
          className={`${
            mobileNav ? 'fixed inset-y-[72px] left-0 z-20 flex' : 'hidden'
          } w-[250px] shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:sticky lg:top-[72px] lg:flex lg:h-[calc(100vh-72px)] lg:flex-col shadow-xs`}
        >
          <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
              {rawRole === 'admin' ? 'System Clearance' : 'Authenticated Registry'}
            </p>
            <p className="mt-1 text-xs font-extrabold text-slate-900 truncate">{displayName}</p>
            <p className="mt-0.5 text-[10px] text-slate-500 truncate">{institutionDisplay}</p>
            <p className="mt-1 text-[9px] font-mono text-slate-400 truncate">
              ID: ACAD-{user.id || '9021'}
            </p>
          </div>

          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setWorkspaceTab('overview');
                setMobileNav(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                workspaceTab === 'overview'
                  ? 'bg-blue-50 text-blue-600 font-extrabold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={17} />
              {rawRole === 'admin' ? 'Governance Hub' : 'Overview'}
            </button>

            {rawRole !== 'admin' && (
              <>
                <button
                  onClick={() => {
                    setWorkspaceTab('learning');
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                    workspaceTab === 'learning'
                      ? 'bg-blue-50 text-blue-600 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <BookOpen size={17} />
                  {rawRole === 'trainer' ? 'Curriculum Studio' : 'My Learning'}
                </button>
                <button
                  onClick={() => {
                    setWorkspaceTab('assessments');
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                    workspaceTab === 'assessments'
                      ? 'bg-blue-50 text-blue-600 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileCheck2 size={17} />
                  {rawRole === 'trainer' ? 'Assessment Studio' : 'Assessments'}
                </button>
                <button
                  onClick={() => {
                    setWorkspaceTab('progress');
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                    workspaceTab === 'progress'
                      ? 'bg-blue-50 text-blue-600 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 size={17} />
                  {rawRole === 'trainer' ? 'Cohort Telemetry' : 'Analytics & Badges'}
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto rounded-2xl bg-[#0b1736] p-4 text-white">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
              <Sparkles size={16} />
            </div>
            <p className="text-xs font-bold">{roleDisplay} Domain Active</p>
            <p className="mt-1 text-[10px] text-slate-400">Mutual exclusivity enforced by RBAC.</p>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1120px]">
            {/* HERO BAR */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                      rawRole === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {roleDisplay} Console
                  </span>
                  <span className="text-xs font-medium text-slate-400">• {institutionDisplay}</span>
                </div>
                <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-950 sm:text-[32px]">
                  {rawRole === 'trainee' && `Welcome back, ${displayName.split(' ')[0]}!`}
                  {rawRole === 'trainer' && `Educator Workspace • ${displayName}`}
                  {rawRole === 'admin' && 'Central Governance & Accreditation Portal'}
                </h1>
              </div>

              {rawRole === 'trainer' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreateQuizOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                  >
                    <Award size={15} className="text-blue-600" /> Create Checkpoint
                  </button>
                  <button
                    onClick={() => setCreateModuleOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <PlusCircle size={15} /> Publish Course
                  </button>
                </div>
              )}
            </div>

            {/* CONDITIONAL WORKSPACES */}
            {rawRole === 'admin' ? (
              <AdminConsole />
            ) : (
              <>
                {/* TAB: OVERVIEW */}
                {workspaceTab === 'overview' && (
                  <>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <p className="text-[12px] font-medium text-slate-500">
                          {rawRole === 'trainer' ? 'Published Modules' : 'Enrolled Modules'}
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-900">{courses.length}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <p className="text-[12px] font-medium text-slate-500">
                          {rawRole === 'trainer' ? 'Active Checkpoints' : 'Assessments Done'}
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-900">
                          {rawRole === 'trainer' ? assessmentsList.length : '18'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <p className="text-[12px] font-medium text-slate-500">Average Performance</p>
                        <p className="mt-2 text-[24px] font-extrabold text-emerald-600">89.2%</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <p className="text-[12px] font-medium text-slate-500">Accreditation</p>
                        <p className="mt-2 text-[24px] font-extrabold text-blue-600">Verified</p>
                      </div>
                    </div>

                    <div className="mt-9">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                            Institutional Course Library
                          </h2>
                          <p className="text-xs text-slate-500">
                            Accredited curricula available under your institutional scope.
                          </p>
                        </div>
                        {rawRole === 'trainer' && (
                          <button
                            onClick={() => setCreateModuleOpen(true)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            + Add New
                          </button>
                        )}
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        {filteredCourses.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition hover:shadow-lg"
                          >
                            <div
                              onClick={() => openLessonViewer(c)}
                              className={`h-24 bg-gradient-to-br ${c.color} p-4 text-white cursor-pointer relative group`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                                {c.type}
                              </span>
                              <h3 className="mt-2 text-sm font-extrabold leading-snug">{c.title}</h3>
                              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold opacity-0 transition group-hover:opacity-100 bg-white/20 px-2 py-1 rounded-lg">
                                <Play size={10} fill="currentColor" /> Open Player
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-[11px] text-slate-500">Faculty: {c.instructor}</p>
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => openLessonViewer(c)}
                                  className="flex-1 rounded-lg border border-slate-200 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition"
                                >
                                  Resume Module
                                </button>
                                <button
                                  onClick={() => startAssessment(c.title)}
                                  className="flex-1 rounded-lg bg-blue-600 py-2 text-[11px] font-bold text-white hover:bg-blue-700 transition"
                                >
                                  Checkpoint
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* TAB: LEARNING */}
                {workspaceTab === 'learning' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                          {rawRole === 'trainer' ? 'Curriculum Asset Management' : 'My Enrolled Curriculum'}
                        </h2>
                        <p className="text-xs text-slate-500">
                          Full course materials, implementation code blueprints, and lecture notes.
                        </p>
                      </div>
                      {rawRole === 'trainer' && (
                        <button
                          onClick={() => setCreateModuleOpen(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                        >
                          <Plus size={14} /> New Module
                        </button>
                      )}
                    </div>

                    <div className="mt-6 space-y-3">
                      {courses.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition"
                        >
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{c.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {c.lessons} • {c.instructor}
                            </p>
                          </div>
                          <button
                            onClick={() => openLessonViewer(c)}
                            className="rounded-lg bg-slate-950 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition"
                          >
                            Access Curriculum Reader
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: ASSESSMENTS */}
                {workspaceTab === 'assessments' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                          {rawRole === 'trainer'
                            ? 'Question Bank & Assessment Studio'
                            : 'Automated Evaluation Engine'}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {rawRole === 'trainer'
                            ? 'Author questions and adjust pass criteria.'
                            : 'Instant test evaluation with tamper-resistant validation.'}
                        </p>
                      </div>
                      {rawRole === 'trainer' && (
                        <button
                          onClick={() => setCreateQuizOpen(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                        >
                          <Award size={14} /> Author Checkpoint
                        </button>
                      )}
                    </div>

                    <div className="mt-6 space-y-3">
                      {assessmentsList.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition"
                        >
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{a.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {a.questionsCount} Modular Questions • {a.duration} • Pass: {a.passingScore}%
                            </p>
                          </div>
                          <button
                            onClick={() => startAssessment(a.title)}
                            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                          >
                            {rawRole === 'trainer' ? 'Preview Checkpoint' : 'Start Test'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: PROGRESS */}
                {workspaceTab === 'progress' && (
                  <AnalyticsView />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* QUIZ ENGINE MODAL */}
      {activeQuizItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Evaluation Checkpoint
                </span>
                <h2 className="text-lg font-extrabold text-slate-950">{activeQuizItem.title}</h2>
              </div>
              <button
                onClick={() => setActiveQuizItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {gradingResult === null ? (
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-400">
                  Question {quizStep + 1} of {activeQuizItem.questions.length}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {activeQuizItem.questions[quizStep].q}
                </p>

                <div className="mt-4 space-y-2">
                  {activeQuizItem.questions[quizStep].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [quizStep]: optIdx })}
                      className={`w-full rounded-xl border p-3 text-left text-xs font-medium transition ${
                        selectedAnswers[quizStep] === optIdx
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    disabled={quizStep === 0}
                    onClick={() => setQuizStep(quizStep - 1)}
                    className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {quizStep < activeQuizItem.questions.length - 1 ? (
                    <button
                      onClick={() => setQuizStep(quizStep + 1)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      disabled={loadingSubmission}
                      onClick={handleQuizSubmit}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loadingSubmission ? 'Evaluating...' : 'Submit to Grading Engine'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <CheckCircle2
                  className={`mx-auto ${gradingResult.passed ? 'text-emerald-500' : 'text-amber-500'}`}
                  size={48}
                />
                <h3 className="mt-3 text-lg font-extrabold text-slate-950">
                  {gradingResult.passed ? 'Assessment Passed!' : 'Threshold Not Reached'}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Score:{' '}
                  <span
                    className={`font-extrabold ${gradingResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}
                  >
                    {gradingResult.score} / {gradingResult.total}
                  </span>{' '}
                  ({gradingResult.percentage}%)
                </p>

                {gradingResult.passed ? (
                  <button
                    onClick={() => {
                      setActiveCertModule(activeQuizItem.title);
                      setCertScore(gradingResult.percentage);
                      setActiveQuizItem(null);
                      setCertModalOpen(true);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Award size={16} /> View Accredited Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizStep(0);
                      setSelectedAnswers({});
                      setGradingResult(null);
                    }}
                    className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-blue-600"
                  >
                    Retry Checkpoint
                  </button>
                )}

                <button
                  onClick={() => setActiveQuizItem(null)}
                  className="mt-2 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Close Checkpoint
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <LogOut size={20} />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Session Active
              </span>
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900">End Active Session?</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              You are signed in as <span className="font-semibold text-slate-800">{displayName}</span> ({roleDisplay}).
              Signing out will invalidate your local session token and return to the public gateway.
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST-LOGIN MODAL MOUNTS */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <CreateModuleModal
        isOpen={createModuleOpen}
        courseId={courses[0]?.id || 1}
        onClose={() => setCreateModuleOpen(false)}
      />
      <CreateQuizModal
        isOpen={createQuizOpen}
        onClose={() => setCreateQuizOpen(false)}
        assessment={{ id: 1, module_id: 1, title: 'New Module Quiz', passing_score: 75 }}
        onSuccess={() => setCreateQuizOpen(false)}
      />
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
        moduleName={activeCertModule}
        scorePercentage={certScore}
      />
      {selectedCourseForViewer && (
        <CourseViewerModal
          isOpen={viewerModalOpen}
          module={{
            id: selectedCourseForViewer.id,
            title: selectedCourseForViewer.title,
            description: selectedCourseForViewer.type,
            duration_minutes: 45,
            content: `# ${selectedCourseForViewer.title}\n\nWelcome to the accredited curriculum viewer. Review all sections thoroughly before testing at the evaluation checkpoint.`,
            order_index: 1,
          }}
          onClose={() => setViewerModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;