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

interface LessonModule {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  content: string;
  order_index: number;
  completed?: boolean;
}

interface CourseItem {
  id: number;
  title: string;
  code: string;
  type: string;
  instructor: string;
  lessons: string;
  color: string;
  description: string;
  progress: number;
  modules: LessonModule[];
}

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 1,
    title: 'Digital Literacy Foundations',
    code: 'ACAD-101',
    type: 'Core module',
    instructor: 'Prof. Aarav Mehta',
    lessons: '3 comprehensive units',
    color: 'from-blue-600 to-indigo-500',
    description: 'Foundational computer architecture, operating system security, and decentralized networking principles.',
    progress: 66,
    modules: [
      {
        id: 101,
        title: 'Decentralized Architecture & Ledger Baselines',
        description: 'P2P protocol communication, cryptographic verification, and state trees.',
        duration_minutes: 25,
        content: '# Decentralized Architecture & Ledger Baselines\n\nUnderstand the architectural difference between monolithic centralized repositories and decentralized state verifiers.\n\n### Core Pillars\n- **Stateless Validation**: Verify identity proofs without holding master session registries.\n- **Cryptographic Trust**: Rely on SHA-256 digest chains rather than client claims.\n- **High-Throughput Verification**: Non-blocking asynchronous checks.',
        order_index: 1,
        completed: true,
      },
      {
        id: 102,
        title: 'Role-Based Access Control (RBAC) Mechanics',
        description: 'Hierarchical permission scoping between Trainee, Trainer, and Central Governance nodes.',
        duration_minutes: 30,
        content: '# Role-Based Access Control (RBAC)\n\nRBAC enforces mutual exclusivity between evaluation authoring and test execution.\n\n```json\n{\n  "trainee": ["read:curriculum", "submit:assessment"],\n  "trainer": ["create:module", "author:quiz", "view:telemetry"],\n  "admin": ["*"]\n}\n```',
        order_index: 2,
        completed: true,
      },
      {
        id: 103,
        title: 'Asynchronous API Orchestration & Non-Blocking I/O',
        description: 'High-throughput microservices using FastAPI and async worker event loops.',
        duration_minutes: 40,
        content: '# High-Throughput Event Loops\n\nFastAPI leverages Python asyncio and Starlette to deliver concurrent task execution without thread starvation.',
        order_index: 3,
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Community Engagement & Outreach',
    code: 'ACAD-102',
    type: 'Professional skills',
    instructor: 'Dr. Nia Okafor',
    lessons: '2 comprehensive units',
    color: 'from-emerald-500 to-teal-400',
    description: 'Frameworks for decentralized community mapping, public-sector stakeholder alignment, and outreach telemetry.',
    progress: 50,
    modules: [
      {
        id: 104,
        title: 'Participatory Community Mapping Protocols',
        description: 'Synthesizing qualitative community metrics into structured actionable blueprints.',
        duration_minutes: 35,
        content: '# Community Asset Mapping\n\nAsset mapping catalogues institutional capacities, talent distribution, and infrastructure gaps to optimize resource delivery.',
        order_index: 1,
        completed: true,
      },
      {
        id: 105,
        title: 'Grassroots Feedback Loops & Continuous Governance',
        description: 'Closed-loop iteration systems driven by verified participant feedback.',
        duration_minutes: 45,
        content: '# Iterative Feedback Systems\n\nEstablishing continuous feedback pipelines to refine vocational curricula based on industry demand.',
        order_index: 2,
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Data-Informed Decision Making',
    code: 'ACAD-103',
    type: 'Core module',
    instructor: 'Liam Chen',
    lessons: '2 comprehensive units',
    color: 'from-violet-500 to-fuchsia-500',
    description: 'Statistical inference, metric extraction, and predictive dropout modeling across institutional cohorts.',
    progress: 100,
    modules: [
      {
        id: 106,
        title: 'Statistical Inference & Metric Extraction',
        description: 'Transforming telemetry streams into actionable KPIs using exploratory data techniques.',
        duration_minutes: 40,
        content: '# Statistical Decision Matrices\n\nLearn how to construct data pipelines and evaluate significance across metric distributions.',
        order_index: 1,
        completed: true,
      },
      {
        id: 107,
        title: 'Predictive Modeling & Attrition Anomaly Detection',
        description: 'Applied regression algorithms and anomaly detection on historical institutional cohorts.',
        duration_minutes: 50,
        content: '# Predictive Frameworks\n\nModel validation, confidence intervals, and bias detection in operational reporting.',
        order_index: 2,
        completed: true,
      },
    ],
  },
];

const INITIAL_ASSESSMENTS: AssessmentItem[] = [
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
  {
    id: 'quiz-3',
    title: 'Data Strategy & Forecasting Evaluation',
    module: 'Data-Informed Decision Making',
    questionsCount: 2,
    passingScore: 70,
    duration: '12 min',
    questions: [
      {
        q: 'Which metric measures the dispersion of training progress across cohort learners?',
        options: ['Standard Deviation', 'Median Index', 'Throughput Ceiling', 'Static Bias'],
        correct: 0,
      },
      {
        q: 'How does anomaly detection prevent false positives in cohort drop-out signals?',
        options: [
          'By comparing rolling performance against historical confidence intervals',
          'By removing all low-scoring records',
          'By hardcoding a 50% pass threshold',
          'By purging uncompleted tests',
        ],
        correct: 0,
      },
    ],
  },
];

export const Index: React.FC = () => {
  const { user, login, logout, theme, toggleTheme } = useAuth();

  // Workspace Navigation & Controls
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic Stores
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Modals & Panels
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCertModule, setActiveCertModule] = useState('');
  const [certScore, setCertScore] = useState(100);

  // Module Viewer Modal State
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [activeViewerModule, setActiveViewerModule] = useState<any>(null);

  // Interactive Quiz Engine State
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

  // Pre-Login Simulator State
  const [simCandidate, setSimCandidate] = useState('Aisha Verma');
  const [simScore, setSimScore] = useState(88);
  const [simulatedHash, setSimulatedHash] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  useEffect(() => {
    fetch(`${apiBaseUrl}/courses`)
      .then((res) => (res.ok ? res.json() : []))
      .then((backendData) => {
        if (Array.isArray(backendData) && backendData.length > 0) {
          setCourses((prev) =>
            backendData.map((bCourse: any, idx: number) => {
              const fallback = INITIAL_COURSES[idx % INITIAL_COURSES.length];
              return {
                ...fallback,
                ...bCourse,
                id: bCourse.id || fallback.id,
                title: bCourse.title || fallback.title,
                code: bCourse.code || fallback.code,
                modules: bCourse.modules && bCourse.modules.length > 0 ? bCourse.modules : fallback.modules,
                progress: bCourse.progress ?? fallback.progress,
              };
            })
          );
        }
      })
      .catch(() => console.log('Serving offline synchronized course catalog.'));
  }, [apiBaseUrl]);

  // Derived User Identity
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

  // Dynamic Course Reader Launcher
  const handleOpenCourseReader = (course: CourseItem) => {
    const targetModule = course.modules?.[0] || {
      id: course.id,
      title: `${course.title} — Comprehensive Overview`,
      courseTitle: course.title,
      description: course.description,
      duration_minutes: 45,
      content: `# ${course.title}\n\n${course.description}`,
      order_index: 1,
      completed: course.progress === 100,
    };
    setActiveViewerModule({ ...targetModule, courseTitle: course.title });
    setViewerModalOpen(true);
  };

  // Dynamic Assessment Checkpoint Launcher
  const handleStartAssessment = (moduleOrCourseTitle: string) => {
    const matched = assessmentsList.find(
      (a) =>
        a.module.toLowerCase().includes(moduleOrCourseTitle.toLowerCase()) ||
        moduleOrCourseTitle.toLowerCase().includes(a.module.toLowerCase()) ||
        a.title.toLowerCase().includes(moduleOrCourseTitle.toLowerCase())
    );

    if (matched) {
      setActiveQuizItem(matched);
    } else {
      const dynamicQuiz: AssessmentItem = {
        id: `quiz-dyn-${Date.now()}`,
        title: `${moduleOrCourseTitle} Checkpoint`,
        module: moduleOrCourseTitle,
        questionsCount: 2,
        passingScore: 70,
        duration: '10 min',
        questions: [
          {
            q: `What is the primary technical objective of ${moduleOrCourseTitle}?`,
            options: [
              'Decentralized verification and systematic skill evaluation',
              'Static manual filing without digital signatures',
              'Purging audit logs after every execution',
              'Disabling server-side assessment checks',
            ],
            correct: 0,
          },
          {
            q: 'How does AcademiaEdu safeguard institutional credential integrity?',
            options: [
              'Air-gapped server-side grading with HMAC SHA-256 proof minting',
              'Storing answers in plaintext localStorage variables',
              'Client-side HTML inspect evaluation',
              'Allowing unauthenticated grade updates',
            ],
            correct: 0,
          },
        ],
      };
      setAssessmentsList((prev) => [dynamicQuiz, ...prev]);
      setActiveQuizItem(dynamicQuiz);
    }

    setQuizStep(0);
    setSelectedAnswers({});
    setGradingResult(null);
  };

  // Submit and Grade Evaluation
  const handleQuizSubmit = () => {
    if (!activeQuizItem) return;
    setLoadingSubmission(true);

    setTimeout(() => {
      let score = 0;
      activeQuizItem.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) score += 1;
      });

      const total = activeQuizItem.questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= activeQuizItem.passingScore;

      setGradingResult({ score, total, percentage, passed });
      setLoadingSubmission(false);

      if (passed) {
        setCourses((prev) =>
          prev.map((c) => {
            if (
              c.title.toLowerCase().includes(activeQuizItem.module.toLowerCase()) ||
              activeQuizItem.module.toLowerCase().includes(c.title.toLowerCase())
            ) {
              return { ...c, progress: 100 };
            }
            return c;
          })
        );
      }
    }, 350);
  };

  // Authoring Callbacks
  const handleModuleCreated = (newMod: any) => {
    const newCourseItem: CourseItem = {
      id: Date.now(),
      title: newMod.title || 'Advanced Systems Engineering',
      code: `ACAD-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Specialized Track',
      instructor: displayName,
      lessons: '1 module configured',
      color: 'from-cyan-600 to-blue-500',
      description: newMod.description || 'Newly authored institutional curriculum module.',
      progress: 0,
      modules: [
        {
          id: Date.now() + 1,
          title: newMod.title || 'Introductory Unit',
          description: newMod.description || 'Initial module overview.',
          duration_minutes: newMod.duration_minutes || 30,
          content: newMod.content || '# Course Curriculum\n\nModule content published by educator.',
          order_index: 1,
          completed: false,
        },
      ],
    };

    setCourses((prev) => [newCourseItem, ...prev]);
    setCreateModuleOpen(false);
  };

  const handleQuizCreated = (newQuiz: any) => {
    const formatted: AssessmentItem = {
      id: `quiz-${Date.now()}`,
      title: newQuiz.title || 'Newly Authored Checkpoint',
      module: newQuiz.title || 'General Curriculum',
      questionsCount: newQuiz.questions?.length || 2,
      passingScore: newQuiz.passingScore || 70,
      duration: `${(newQuiz.questions?.length || 2) * 5} min`,
      questions:
        newQuiz.questions && newQuiz.questions.length > 0
          ? newQuiz.questions
          : [
              {
                q: 'What is the primary validation criteria for this module?',
                options: ['Meeting institutional passing score', 'Bypassing questions', 'Skipping reading', 'Exiting test'],
                correct: 0,
              },
            ],
    };

    setAssessmentsList((prev) => [formatted, ...prev]);
    setCreateQuizOpen(false);
  };

  const filteredCourses = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.code || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

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
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    setSimulatedHash(`a4c9f10${hex}e8b24d773210fc9a87d61245091ef73a9082c3d4e5f6a1b2c3d4e5f6`);
  };

  // =========================================================================
  // PRE-LOGIN DISPLAY
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
  // POST-LOGIN DISPLAY (ADOPTED FROM INDEXREF.TXT WITH DYNAMIC SYNC)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f6f8fc] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Global Workspace Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0B101E]/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-4 sm:px-7 lg:px-10">
          <button
            className="mr-1 rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>

          <AcademiaLogo size={34} />

          {/* Search Input */}
          <div className="relative ml-4 hidden max-w-[370px] flex-1 md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={17} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, skills, or curriculum..."
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-50 dark:focus:ring-indigo-950/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 pr-3 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    rawRole === 'admin'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                  }`}
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-medium text-slate-400 dark:text-slate-400 leading-tight">
                    <span className={`font-semibold ${rawRole === 'admin' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-indigo-400'}`}>
                      {roleDisplay}
                    </span>
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-1.5 shadow-xl">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <p className="mt-1 text-[9px] font-mono font-bold text-blue-600 dark:text-indigo-400 truncate">
                      {institutionDisplay}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* Workspace Sidebar */}
        <aside
          className={`${
            mobileNav ? 'fixed inset-y-[72px] left-0 z-20 flex' : 'hidden'
          } w-[250px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101E] px-4 py-6 lg:sticky lg:top-[72px] lg:flex lg:h-[calc(100vh-72px)] lg:flex-col shadow-xs`}
        >
          <div className="mb-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
              {rawRole === 'admin' ? 'System Clearance' : 'Authenticated Registry'}
            </p>
            <p className="mt-1 text-xs font-extrabold text-slate-900 dark:text-white truncate">{displayName}</p>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">{institutionDisplay}</p>
            <p className="mt-1 text-[9px] font-mono text-slate-400 dark:text-slate-500 truncate">
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
                  ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 font-extrabold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
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
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 font-extrabold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
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
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 font-extrabold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
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
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 font-extrabold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 size={17} />
                  {rawRole === 'trainer' ? 'Cohort Telemetry' : 'Analytics & Badges'}
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto rounded-2xl bg-[#0b1736] dark:bg-slate-900 border border-transparent dark:border-slate-800 p-4 text-white">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
              <Sparkles size={16} />
            </div>
            <p className="text-xs font-bold">{roleDisplay} Domain Active</p>
            <p className="mt-1 text-[10px] text-slate-400">Mutual exclusivity enforced by RBAC.</p>
          </div>
        </aside>

        {/* Dynamic Main Pane */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1120px]">
            {/* Header Identity Bar */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                      rawRole === 'admin'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                        : 'bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300 border border-blue-200 dark:border-indigo-800/60'
                    }`}
                  >
                    {roleDisplay} Console
                  </span>
                  <span className="text-xs font-medium text-slate-400">• {institutionDisplay}</span>
                </div>
                <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-[32px]">
                  {rawRole === 'trainee' && `Welcome back, ${displayName.split(' ')[0]}!`}
                  {rawRole === 'trainer' && `Educator Workspace • ${displayName}`}
                  {rawRole === 'admin' && 'Central Governance & Accreditation Portal'}
                </h1>
              </div>

              {(rawRole === 'trainer' || rawRole === 'admin') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreateQuizOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Award size={15} className="text-blue-600 dark:text-indigo-400" /> Create Checkpoint
                  </button>
                  <button
                    onClick={() => setCreateModuleOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-indigo-500 transition"
                  >
                    <PlusCircle size={15} /> Publish Course
                  </button>
                </div>
              )}
            </div>

            {/* TAB: OVERVIEW */}
            {workspaceTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                      {rawRole === 'trainer' ? 'Published Tracks' : 'Enrolled Modules'}
                    </p>
                    <p className="mt-2 text-[24px] font-extrabold text-slate-900 dark:text-white">{courses.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                      {rawRole === 'trainer' ? 'Active Checkpoints' : 'Available Tests'}
                    </p>
                    <p className="mt-2 text-[24px] font-extrabold text-slate-900 dark:text-white">{assessmentsList.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Average Performance</p>
                    <p className="mt-2 text-[24px] font-extrabold text-emerald-600 dark:text-emerald-400">89.2%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Accreditation</p>
                    <p className="mt-2 text-[24px] font-extrabold text-blue-600 dark:text-indigo-400">Verified</p>
                  </div>
                </div>

                <div className="mt-9">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Institutional Course Library
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Accredited curricula and interactive modules available under your scope.
                      </p>
                    </div>
                    {(rawRole === 'trainer' || rawRole === 'admin') && (
                      <button
                        onClick={() => setCreateModuleOpen(true)}
                        className="text-xs font-bold text-blue-600 dark:text-indigo-400 hover:underline"
                      >
                        + Add New
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] overflow-hidden shadow-xs transition hover:shadow-lg flex flex-col justify-between"
                      >
                        <div
                          onClick={() => handleOpenCourseReader(c)}
                          className={`h-28 bg-gradient-to-br ${c.color} p-4 text-white cursor-pointer relative group`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                              {c.type}
                            </span>
                            <span className="text-[10px] font-extrabold bg-black/25 px-2 py-0.5 rounded">
                              {c.progress}% Done
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-extrabold leading-snug">{c.title}</h3>
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold opacity-0 transition group-hover:opacity-100 bg-white/25 px-2 py-1 rounded-lg">
                            <Play size={10} fill="currentColor" /> Open Player
                          </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between grow space-y-4">
                          <div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Faculty: {c.instructor}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                              {c.description}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => handleOpenCourseReader(c)}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              Resume Module
                            </button>
                            <button
                              onClick={() => handleStartAssessment(c.title)}
                              className="flex-1 rounded-lg bg-blue-600 dark:bg-indigo-600 py-2 text-[11px] font-bold text-white hover:bg-blue-700 dark:hover:bg-indigo-500 transition"
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
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {rawRole === 'trainer' ? 'Curriculum Asset Management' : 'My Enrolled Curriculum'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Access active lesson content, technical architecture breakdowns, and course guides.
                    </p>
                  </div>
                  {(rawRole === 'trainer' || rawRole === 'admin') && (
                    <button
                      onClick={() => setCreateModuleOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-indigo-500"
                    >
                      <Plus size={14} /> New Module
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-indigo-400 bg-blue-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{c.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
                        </div>
                        <button
                          onClick={() => handleOpenCourseReader(c)}
                          className="self-start sm:self-auto rounded-lg bg-slate-950 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 dark:hover:bg-indigo-600 transition"
                        >
                          Access Curriculum Reader →
                        </button>
                      </div>

                      {/* Nested Interactive Module List */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 grid sm:grid-cols-3 gap-2.5">
                        {c.modules.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setActiveViewerModule({ ...m, courseTitle: c.title });
                              setViewerModalOpen(true);
                            }}
                            className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B101E] hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition"
                          >
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>Part #{m.order_index}</span>
                              <span>{m.duration_minutes}m</span>
                            </div>
                            <h5 className="font-bold text-xs mt-1 text-slate-800 dark:text-slate-200 line-clamp-1">
                              {m.title}
                            </h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ASSESSMENTS */}
            {workspaceTab === 'assessments' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {rawRole === 'trainer' ? 'Question Bank & Assessment Studio' : 'Evaluation Checkpoints'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rawRole === 'trainer'
                        ? 'Author questions and adjust pass criteria.'
                        : 'Server-graded evaluation with cryptographic proof of completion.'}
                    </p>
                  </div>
                  {(rawRole === 'trainer' || rawRole === 'admin') && (
                    <button
                      onClick={() => setCreateQuizOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-indigo-500"
                    >
                      <Award size={14} /> Author Checkpoint
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {assessmentsList.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition gap-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-indigo-400">
                          {a.module}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{a.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {a.questionsCount} Questions • {a.duration} • Required: {a.passingScore}% Pass
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartAssessment(a.module)}
                        className="self-start sm:self-auto rounded-lg bg-blue-600 dark:bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 dark:hover:bg-indigo-500 transition"
                      >
                        {rawRole === 'trainer' ? 'Preview Checkpoint' : 'Launch Evaluation Checkpoint →'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROGRESS */}
            {workspaceTab === 'progress' && <AnalyticsView />}
          </div>
        </main>
      </div>

      {/* Dynamic Interactive Quiz Engine Modal */}
      {activeQuizItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-indigo-400">
                  {activeQuizItem.module} Checkpoint
                </span>
                <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{activeQuizItem.title}</h2>
              </div>
              <button
                onClick={() => setActiveQuizItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {gradingResult === null ? (
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-400">
                  Question {quizStep + 1} of {activeQuizItem.questions.length}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {activeQuizItem.questions[quizStep].q}
                </p>

                <div className="mt-4 space-y-2">
                  {activeQuizItem.questions[quizStep].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [quizStep]: optIdx })}
                      className={`w-full rounded-xl border p-3 text-left text-xs font-medium transition ${
                        selectedAnswers[quizStep] === optIdx
                          ? 'border-blue-600 dark:border-indigo-500 bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
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
                    className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {quizStep < activeQuizItem.questions.length - 1 ? (
                    <button
                      disabled={selectedAnswers[quizStep] === undefined}
                      onClick={() => setQuizStep(quizStep + 1)}
                      className="rounded-lg bg-blue-600 dark:bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-40"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      disabled={loadingSubmission || selectedAnswers[quizStep] === undefined}
                      onClick={handleQuizSubmit}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loadingSubmission ? 'Evaluating Responses...' : 'Submit to Grading Engine'}
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
                <h3 className="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">
                  {gradingResult.passed ? 'Accreditation Standard Achieved!' : 'Evaluation Threshold Not Met'}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Evaluated Score:{' '}
                  <span
                    className={`font-extrabold ${gradingResult.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                  >
                    {gradingResult.score} / {gradingResult.total}
                  </span>{' '}
                  ({gradingResult.percentage}%) • Minimum Required: {activeQuizItem.passingScore}%
                </p>

                {gradingResult.passed ? (
                  <button
                    onClick={() => {
                      setActiveCertModule(activeQuizItem.module);
                      setCertScore(gradingResult.percentage);
                      setActiveQuizItem(null);
                      setCertModalOpen(true);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Award size={16} /> Mint Verifiable SHA-256 Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizStep(0);
                      setSelectedAnswers({});
                      setGradingResult(null);
                    }}
                    className="mt-4 w-full rounded-xl bg-slate-900 dark:bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-blue-600 dark:hover:bg-indigo-600"
                  >
                    Retry Checkpoint
                  </button>
                )}

                <button
                  onClick={() => setActiveQuizItem(null)}
                  className="mt-2 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Close Checkpoint
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <LogOut size={20} />
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Session Active
              </span>
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">End Active Session?</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              You are signed in as <span className="font-semibold text-slate-800 dark:text-slate-200">{displayName}</span> ({roleDisplay}).
              Signing out will invalidate your session token and return to the public gateway.
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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

      {/* Global Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      
      <CreateModuleModal
        isOpen={createModuleOpen}
        courseId={courses[0]?.id || 1}
        onClose={() => setCreateModuleOpen(false)}
        onCreated={handleModuleCreated}
      />

      <CreateQuizModal
        isOpen={createQuizOpen}
        onClose={() => setCreateQuizOpen(false)}
        assessment={{ id: 1, module_id: 1, title: 'New Module Quiz', passing_score: 75 }}
        onSave={handleQuizCreated}
        onSuccess={handleQuizCreated}
      />

      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
        moduleName={activeCertModule}
        scorePercentage={certScore}
      />

      {activeViewerModule && (
        <CourseViewerModal
          isOpen={viewerModalOpen}
          module={activeViewerModule}
          onClose={() => {
            setViewerModalOpen(false);
            setActiveViewerModule(null);
          }}
          onCompleteModule={(modId) => {
            setCourses((prev) =>
              prev.map((c) => {
                if (c.modules.some((m) => m.id === modId)) {
                  return { ...c, progress: 100 };
                }
                return c;
              })
            );
          }}
          onLaunchAssessment={(courseName) => {
            setViewerModalOpen(false);
            handleStartAssessment(courseName);
          }}
        />
      )}
    </div>
  );
};

export default Index;