import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
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
  Star,
  Upload,
  Megaphone,
  UserCheck,
  FileText,
  X,
  ShieldCheck,
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
import TrainerProfileModal, { TrainerCompetency } from '../components/TrainerProfileModal';
import FeedbackModal from '../components/FeedbackModal';
import UploadResourceModal from '../components/UploadResourceModal';
import AnnouncementsModal from '../components/AnnouncementsModal';

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
  enrolled: boolean;
  modules: LessonModule[];
}

const TRAINER_PROFILES: Record<string, TrainerCompetency> = {
  'Prof. Aarav Mehta': {
    name: 'Prof. Aarav Mehta',
    designation: 'Principal Pedagogical Architect',
    institution: 'IIT Delhi • Department of Computer Science',
    experienceYears: 12,
    rating: 4.9,
    verified: true,
    skills: ['Microservices', 'FastAPI', 'Distributed Systems', 'Data Structures', 'RBAC Security'],
    bio: 'Pioneering decentralized capacity building and air-gapped evaluation systems for national vocational education cohorts.',
    publishedCoursesCount: 6,
    accreditationPassRate: '94.2%',
  },
  'Dr. Nia Okafor': {
    name: 'Dr. Nia Okafor',
    designation: 'Senior Outreach Specialist',
    institution: 'National Capacity Network',
    experienceYears: 9,
    rating: 4.8,
    verified: true,
    skills: ['Community Mapping', 'Participatory Action Research (PAR)', 'Public Sector Governance'],
    bio: 'Dedicated to grassroots skill acquisition, institutional outreach mapping, and scalable stakeholder feedback workflows.',
    publishedCoursesCount: 4,
    accreditationPassRate: '91.8%',
  },
  'Liam Chen': {
    name: 'Liam Chen',
    designation: 'Lead Data Strategist',
    institution: 'Apex Learning Analytics Lab',
    experienceYears: 8,
    rating: 4.9,
    verified: true,
    skills: ['Statistical Inference', 'Predictive Modeling', 'Anomaly Detection', 'Cohort Telemetry'],
    bio: 'Specializing in learner retention algorithms, statistical score variance, and server-side autograding pipelines.',
    publishedCoursesCount: 5,
    accreditationPassRate: '96.0%',
  },
};

const TRAINER_LINKEDIN_DATA: Record<string, {
  headline: string;
  location: string;
  about: string;
  experience: { role: string; organization: string; duration: string; description: string }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: { title: string; issuer: string; id: string; verified: boolean }[];
  skills: string[];
}> = {
  DEFAULT: {
    headline: 'Principal Pedagogical Architect • Lead Fellow in Distributed Computing Systems',
    location: 'New Delhi, India • AcademiaEdu Central Faculty',
    about:
      'Passionate educator and systems architect specializing in asynchronous backend orchestration, non-blocking concurrency, and cryptographic accreditation standards. Dedicated to bridging the gap between theoretical computer science and nationwide industry capacity building through hands-on, verifiable curricula.',
    experience: [
      {
        role: 'Principal Pedagogical Fellow & Systems Architect',
        organization: 'Capacity Connect National Training Framework',
        duration: '2023 - Present • 3 yrs',
        description:
          'Authoring core technical curricula for microservices and cloud scalability, conducting server-side checkpoint evaluations, and mentoring institutional trainers.',
      },
      {
        role: 'Associate Professor & Systems Researcher',
        organization: 'Department of Computer Science & Engineering',
        duration: '2019 - 2023 • 4 yrs',
        description:
          'Supervised capstone engineering projects on decentralized data validation, distributed caching consistency, and high-throughput web APIs.',
      },
      {
        role: 'Senior Backend Engineer & Technical Lead',
        organization: 'CloudScale Technologies',
        duration: '2015 - 2019 • 4 yrs',
        description:
          'Designed fault-tolerant microservice clusters, automated gRPC/FastAPI pipelines, and database replication clusters for high-concurrency enterprise workloads.',
      },
    ],
    education: [
      {
        degree: 'Ph.D. in Computer Science & Distributed Systems',
        institution: 'Indian Institute of Technology (IIT) Delhi',
        year: '2019',
      },
      {
        degree: 'M.Tech in Software Engineering',
        institution: 'Delhi Technological University (DTU)',
        year: '2015',
      },
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Guru Gobind Singh Indraprastha University',
        year: '2013',
      },
    ],
    certifications: [
      {
        title: 'Certified Kubernetes Cloud Native Architect (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        id: 'CKA-90421-CC',
        verified: true,
      },
      {
        title: 'Master Evaluator & Technical Capacity Fellow',
        issuer: 'National Skill Development & Accreditation Board',
        id: 'NSDC-CAP-2026',
        verified: true,
      },
      {
        title: 'High-Throughput Microservice Architecture Specialist',
        issuer: 'Open Systems Consortium',
        id: 'OSC-8812-DIST',
        verified: true,
      },
    ],
    skills: [
      'Asynchronous FastAPI',
      'Distributed Systems',
      'HMAC SHA-256 Cryptography',
      'RBAC Security',
      'gRPC Architecture',
      'Database Concurrency',
      'Pedagogical Design',
      'Cohort Telemetry',
    ],
  },
};

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
    enrolled: true,
    modules: [
      {
        id: 101,
        title: 'Decentralized Architecture & Ledger Baselines',
        description: 'P2P protocol communication, cryptographic verification, and state trees.',
        duration_minutes: 25,
        content: '# Decentralized Architecture\n\nUnderstand stateless verification and HMAC SHA-256 integrity models.',
        order_index: 1,
        completed: true,
      },
      {
        id: 102,
        title: 'Role-Based Access Control (RBAC) Mechanics',
        description: 'Hierarchical permission scoping between Trainee, Trainer, and Central Governance nodes.',
        duration_minutes: 30,
        content: '# RBAC Architecture\n\nEnforcing strict mutual exclusivity across evaluation authoring and test execution.',
        order_index: 2,
        completed: true,
      },
      {
        id: 103,
        title: 'Asynchronous API Orchestration & Non-Blocking I/O',
        description: 'High-throughput microservices using FastAPI and async worker event loops.',
        duration_minutes: 40,
        content: '# FastAPI Asynchronous Event Loops\n\nNon-blocking concurrent I/O throughput to handle high-concurrency assessment submission bursts.',
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
    enrolled: true,
    modules: [
      {
        id: 104,
        title: 'Participatory Community Mapping Protocols',
        description: 'Synthesizing qualitative community metrics into structured actionable blueprints.',
        duration_minutes: 35,
        content: '# Asset Mapping\n\nCataloging localized competencies to optimize resource delivery.',
        order_index: 1,
        completed: true,
      },
      {
        id: 105,
        title: 'Grassroots Feedback Loops & Continuous Governance',
        description: 'Closed-loop iteration systems driven by verified participant feedback.',
        duration_minutes: 45,
        content: '# Feedback Infrastructure\n\nTranslating post-test feedback into continuous curriculum refinements.',
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
    enrolled: false,
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
];

export const Index: React.FC = () => {
  const { user, login, logout, theme, toggleTheme } = useAuth();

  // Navigation & View State
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic Content Stores
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // SIH 26075 Governance Data
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'SIH 26075 Nationwide Accreditation Window Active', date: 'Sept 2026', author: 'Root Governance' },
    { id: 2, title: 'Decentralized Microservices Track Published by Faculty', date: 'Sept 2026', author: 'Technical Board' },
  ]);
  const [pendingTrainers, setPendingTrainers] = useState([
    { id: 201, name: 'Dr. Kabir Sen', institution: 'IIT Bombay', domain: 'Cloud Security', status: 'Pending Approval' },
    { id: 202, name: 'Prof. Sunita Rao', institution: 'NIT Trichy', domain: 'Edge AI Systems', status: 'Pending Approval' },
  ]);

  // Global Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  // SIH Specific Modals
  const [activeTrainerProfile, setActiveTrainerProfile] = useState<TrainerCompetency | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFeedbackCourse, setActiveFeedbackCourse] = useState<{ title: string; instructor: string } | null>(null);
  const [uploadResourceOpen, setUploadResourceOpen] = useState(false);
  const [announcementsModalOpen, setAnnouncementsModalOpen] = useState(false);

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCertModule, setActiveCertModule] = useState('');
  const [certScore, setCertScore] = useState(100);

  // Lesson Viewer Modal State
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [activeViewerModule, setActiveViewerModule] = useState<any>(null);

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
      badge: 'Smart India Hackathon 2026 • Problem Statement SIH 26075',
      title: 'Decentralized Capacity Building & Unified LMS Architecture',
      desc: 'An institutional web platform resolving fragmented educational assets, unverified instructor credentials, and untracked learner telemetry through automated governance.',
      icon: '🏛️',
    },
    {
      badge: 'Core Platform Differentiator',
      title: 'Learner-Visible Trainer Competency Profiles',
      desc: 'Transparent verification of faculty qualifications, accredited domain experience, and historical cohort pass rates prior to course enrollment.',
      icon: '⭐',
    },
    {
      badge: 'Cryptographic Provenance Engine',
      title: 'Air-Gapped Grading & HMAC SHA-256 Credentials',
      desc: 'Tamper-resistant server-side assessment autograding minting immutable cryptographic digests registered to verifiable institutional profiles.',
      icon: '🔐',
    },
  ];

  // Simulator State
  const [simCandidate, setSimCandidate] = useState('Divyansh Chauhan');
  const [simScore, setSimScore] = useState(92);
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
      .catch(() => console.log('Serving local synchronized Capacity Connect catalog.'));
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
  const institutionDisplay = (user as any)?.institution || 'Capacity Connect Central Node';

  const handleToggleEnroll = (courseId: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled: !c.enrolled } : c))
    );
  };

  const handleOpenCourseReader = (course: CourseItem) => {
    const targetModule = course.modules?.[0] || {
      id: course.id,
      title: `${course.title} — Unit 1`,
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
        title: `${moduleOrCourseTitle} Evaluation`,
        module: moduleOrCourseTitle,
        questionsCount: 2,
        passingScore: 70,
        duration: '10 min',
        questions: [
          {
            q: `What is the primary technical objective of ${moduleOrCourseTitle}?`,
            options: [
              'Standardized competence development and verifiable skills acquisition',
              'Static manual filing without digital tracking',
              'Purging evaluation logs after execution',
              'Disabling server-side assessment checks',
            ],
            correct: 0,
          },
          {
            q: 'How does AcademiaEdu guarantee credential validity?',
            options: [
              'Immutable HMAC SHA-256 cryptographic signatures tied to candidate public identities',
              'Plaintext unencrypted client storage',
              'Unverified manual self-attestation',
              'Editable frontend evaluation states',
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

  const handleApproveTrainer = (trainerId: number) => {
    setPendingTrainers((prev) => prev.filter((t) => t.id !== trainerId));
  };

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
      enrolled: true,
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
        newQuiz.questions?.length > 0
          ? newQuiz.questions
          : [
              {
                q: 'What is the primary validation criteria for this module?',
                options: ['Meeting passing score threshold', 'Bypassing questions', 'Skipping reading', 'Exiting test'],
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
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  const quickDemoLogin = (role: 'trainee' | 'trainer' | 'admin') => {
    if (role === 'trainee') {
      login('demo-token-trainee', { id: 101, name: 'Divyansh Chauhan', email: 'divyansh@connect.edu', role: 'trainee' });
    } else if (role === 'trainer') {
      login('demo-token-trainer', { id: 102, name: 'Prof. Aarav Mehta', email: 'aarav@connect.edu', role: 'trainer' });
    } else {
      login('demo-token-admin', { id: 103, name: 'Central Root Authority', email: 'admin.root@capacityconnect.gov', role: 'admin' });
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
  // PRE-LOGIN DISPLAY (ENTERPRISE PRODUCT DESIGN + SIH 26075 SPECIFICATION)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between relative overflow-x-hidden">
        {/* Atmospheric Glow Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] rounded-full" />
          <div className="absolute top-96 -left-40 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-600/5 blur-[120px] rounded-full" />
        </div>

        {/* Global Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B101E]/90 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between shadow-xs dark:shadow-2xl dark:shadow-black/40">
          <AcademiaLogo size={36} />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:text-white transition shadow-xs"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-12 w-full grow relative z-10 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Context Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
              <span>Smart India Hackathon 2026 • Problem Statement SIH 26075 • Team Techtonic</span>
            </div>

            {/* Enterprise Product Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
              Institutional Capacity Building & Verifiable Learning Engine
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              A unified digital ecosystem supporting organizational training, transparent trainer competency mapping, auto-graded assessments, and cryptographic qualifications.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                Portal Sign In / Register
              </button>
              <button
                onClick={() => setShowArchModal(true)}
                className="px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 transition text-xs sm:text-sm shadow-xs"
              >
                Architecture Blueprint ↗
              </button>
              <button
                onClick={() => setShowSimulatorModal(true)}
                className="px-6 py-3 rounded-xl font-bold border border-cyan-300 dark:border-cyan-800/70 bg-cyan-50/80 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-950/60 transition text-xs sm:text-sm shadow-xs"
              >
                Live Hash Simulator ⚙
              </button>
            </div>
          </div>

          {/* Interactive Slide Carousel */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1526]/80 backdrop-blur-md shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {slides[currentSlide].badge}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((p) => (p === 0 ? slides.length - 1 : p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-sm font-bold transition"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentSlide((p) => (p === slides.length - 1 ? 0 : p + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-sm font-bold transition"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-2 text-6xl flex justify-center items-center p-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
                {slides[currentSlide].icon}
              </div>
              <div className="md:col-span-10 space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{slides[currentSlide].title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{slides[currentSlide].desc}</p>
              </div>
            </div>
          </div>

          {/* Evaluator 1-Click Instant Gateways */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1526]/80 shadow-xl dark:shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Evaluator Instant Gateway</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bypass manual authentication to evaluate role-isolated permissions and custom dashboards:
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/90 flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/50">
                    Trainee Persona
                  </span>
                  <h4 className="font-bold text-base mt-2 text-slate-900 dark:text-white">Divyansh Chauhan</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Find & enroll, inspect trainer competency, complete modules, mint certificates, and submit feedback.
                  </p>
                </div>
                <button
                  onClick={() => quickDemoLogin('trainee')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
                >
                  Launch as Trainee →
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/90 flex flex-col justify-between space-y-4 hover:border-cyan-400 dark:hover:border-cyan-500/40 transition">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800/50">
                    Trainer Persona
                  </span>
                  <h4 className="font-bold text-base mt-2 text-slate-900 dark:text-white">Prof. Aarav Mehta</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    LinkedIn-style competency profile, training track management, multi-format resource uploads, and quiz creation.
                  </p>
                </div>
                <button
                  onClick={() => quickDemoLogin('trainer')}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition"
                >
                  Launch as Trainer →
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/90 flex flex-col justify-between space-y-4 hover:border-purple-400 dark:hover:border-purple-500/40 transition">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/50">
                    Admin Persona
                  </span>
                  <h4 className="font-bold text-base mt-2 text-slate-900 dark:text-white">Team Techtonic Central Admin</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Approve incoming trainers, broadcast institutional announcements, and monitor central governance audits.
                  </p>
                </div>
                <button
                  onClick={() => quickDemoLogin('admin')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition"
                >
                  Launch as Admin →
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Architecture Blueprint Modal */}
        {showArchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AcademiaEdu Architecture Blueprint</h3>
                <button onClick={() => setShowArchModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold">✕</button>
              </div>
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B101E] border border-slate-200 dark:border-slate-800">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">[Frontend Tier: React + Vite + Tailwind]</div>
                  Stateless interface interacting via OAuth2 Bearer JWT. Zero client evaluation secrets.
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B101E] border border-slate-200 dark:border-slate-800">
                  <div className="text-cyan-600 dark:text-cyan-400 font-bold mb-1">[Backend Engine: FastAPI + SQLAlchemy + PostgreSQL]</div>
                  Asynchronous autograding engine & HMAC SHA-256 digital certificate stamping.
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B101E] border border-slate-200 dark:border-slate-800">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-1">[Differentiator: Trainer Competency Matching]</div>
                  Peer-reviewed trainer profiles & verified institutional skill accreditation mapping.
                </div>
              </div>
              <button onClick={() => setShowArchModal(false)} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
                Close Blueprint
              </button>
            </div>
          </div>
        )}

        {/* Live Simulator Modal */}
        {showSimulatorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live HMAC SHA-256 Simulator</h3>
                <button onClick={() => setShowSimulatorModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Candidate Name</label>
                  <input
                    type="text"
                    value={simCandidate}
                    onChange={(e) => setSimCandidate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101E] text-xs mt-1 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Passing Score (%)</label>
                  <input
                    type="number"
                    value={simScore}
                    onChange={(e) => setSimScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101E] text-xs mt-1 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <button onClick={handleSimulateHash} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
                  Compute Verifiable Digital Digest
                </button>
                {simulatedHash && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#0B101E] border border-slate-200 dark:border-slate-800 break-all text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    {simulatedHash}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          AcademiaEdu • Smart India Hackathon 2026 • Problem Statement SIH 26075 • Team Techtonic
        </footer>
      </div>
    );
  }

  // =========================================================================
  // POST-LOGIN DISPLAY (AUTHENTICATED LMS WORKSPACE)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f6f8fc] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Global Header */}
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
              placeholder="Search courses, skills, or faculty..."
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

      {/* Main Workspace Grid */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileNav ? 'fixed inset-y-[72px] left-0 z-20 flex' : 'hidden'
          } w-[250px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101E] px-4 py-6 lg:sticky lg:top-[72px] lg:flex lg:h-[calc(100vh-72px)] lg:flex-col shadow-xs`}
        >
          <div className="mb-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
              {rawRole === 'admin' ? 'Central Governance' : 'Authenticated Registry'}
            </p>
            <p className="mt-1 text-xs font-extrabold text-slate-900 dark:text-white truncate">{displayName}</p>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">{institutionDisplay}</p>
            <p className="mt-1 text-[9px] font-mono text-slate-400 dark:text-slate-500 truncate">
              ID: CC-{user.id || '9021'}
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
                  {rawRole === 'trainer' ? 'Question Bank Manager' : 'Assessments'}
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
            <p className="text-xs font-bold">{roleDisplay} Tier Active</p>
            <p className="mt-1 text-[10px] text-slate-400">Strict RBAC segregation enforced.</p>
          </div>
        </aside>

        {/* Dynamic Main Workspace Pane */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1120px]">
            {/* Institutional Announcement Banner */}
            {announcements.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Central Announcement • {announcements[0].date}
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {announcements[0].title}
                    </p>
                  </div>
                </div>
                {rawRole === 'admin' && (
                  <button
                    onClick={() => setAnnouncementsModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                  >
                    + Post New
                  </button>
                )}
              </div>
            )}

            {/* Context Hero Header */}
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
                    {roleDisplay} Workspace
                  </span>
                  <span className="text-xs font-medium text-slate-400">• {institutionDisplay}</span>
                </div>
                <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-[32px]">
                  {rawRole === 'trainee' && `Welcome back, ${displayName.split(' ')[0]}!`}
                  {rawRole === 'trainer' && `Faculty Workspace • ${displayName}`}
                  {rawRole === 'admin' && 'Central Governance & Accreditation Portal'}
                </h1>
              </div>

              {/* Action Trigger Buttons */}
              {rawRole === 'trainer' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setUploadResourceOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Upload size={14} className="text-blue-600 dark:text-indigo-400" /> Upload Resources
                  </button>
                  <button
                    onClick={() => setCreateQuizOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Award size={14} className="text-blue-600 dark:text-indigo-400" /> Create Checkpoint
                  </button>
                  <button
                    onClick={() => setCreateModuleOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-indigo-500 transition"
                  >
                    <PlusCircle size={15} /> Publish Course
                  </button>
                </div>
              )}

              {rawRole === 'admin' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAnnouncementsModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition"
                  >
                    <Megaphone size={14} /> Broadcast Announcement
                  </button>
                </div>
              )}
            </div>

            {/* TAB: OVERVIEW */}
            {workspaceTab === 'overview' && (
              <>
                {rawRole === 'trainer' ? (
                  /* LINKEDIN-STYLE FACULTY COMPETENCY PROFILE */
                  <div className="space-y-6 mb-10">
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] overflow-hidden shadow-xs">
                      <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 relative">
                        <div className="absolute top-3 right-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-300" />
                            Verified Institutional Faculty
                          </span>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-0 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4">
                          <div className="flex items-end gap-4">
                            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 border-4 border-white dark:border-[#0E1526] flex items-center justify-center text-white text-3xl font-black shadow-lg">
                              {displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="mb-1">
                              <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                  {displayName}
                                </h2>
                                <span className="text-blue-600 dark:text-indigo-400" title="Verified Educator">
                                  <ShieldCheck size={18} />
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                                {TRAINER_LINKEDIN_DATA.DEFAULT.headline}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {TRAINER_LINKEDIN_DATA.DEFAULT.location}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Courses</span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{courses.length}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pass Rate</span>
                              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">94.2%</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Learner Rating</span>
                              <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-0.5">
                                <Star size={12} fill="currentColor" /> 4.9
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs space-y-3">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText size={16} className="text-blue-600 dark:text-indigo-400" /> About
                          </h3>
                          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {TRAINER_LINKEDIN_DATA.DEFAULT.about}
                          </p>
                        </div>

                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase size={16} className="text-blue-600 dark:text-indigo-400" /> Professional Experience
                          </h3>
                          <div className="space-y-4 pt-1">
                            {TRAINER_LINKEDIN_DATA.DEFAULT.experience.map((exp, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0"
                              >
                                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                                  <Building2 size={18} />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {exp.role}
                                  </h4>
                                  <p className="text-xs font-semibold text-blue-600 dark:text-indigo-400">
                                    {exp.organization}
                                  </p>
                                  <p className="text-[11px] text-slate-400 font-mono">{exp.duration}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed pt-1">
                                    {exp.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <GraduationCap size={16} className="text-blue-600 dark:text-indigo-400" /> Education & Qualifications
                          </h3>
                          <div className="space-y-3.5">
                            {TRAINER_LINKEDIN_DATA.DEFAULT.education.map((edu, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                  {edu.degree}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{edu.institution}</p>
                                <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{edu.year}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <Award size={16} className="text-emerald-500" /> Licenses & Certifications
                          </h3>
                          <div className="space-y-3">
                            {TRAINER_LINKEDIN_DATA.DEFAULT.certifications.map((cert, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                    {cert.title}
                                  </h4>
                                  <ShieldCheck size={14} className="text-emerald-500 shrink-0 ml-1" />
                                </div>
                                <p className="text-[11px] text-slate-400">{cert.issuer}</p>
                                <p className="text-[10px] font-mono text-slate-500">ID: {cert.id}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs space-y-3">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-blue-600 dark:text-indigo-400" /> Verified Competencies
                          </h3>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {TRAINER_LINKEDIN_DATA.DEFAULT.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300 font-semibold text-[11px] border border-blue-200/60 dark:border-indigo-800/60"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STANDARD 4 STAT CARDS (TRAINEE & ADMIN OVERVIEW) */
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                        {rawRole === 'admin' ? 'Managed Tracks' : 'Enrolled Tracks'}
                      </p>
                      <p className="mt-2 text-[24px] font-extrabold text-slate-900 dark:text-white">
                        {courses.filter((c) => (rawRole === 'trainee' ? c.enrolled : true)).length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                        {rawRole === 'admin' ? 'Total Checkpoints' : 'Available Checkpoints'}
                      </p>
                      <p className="mt-2 text-[24px] font-extrabold text-slate-900 dark:text-white">
                        {assessmentsList.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Average Score</p>
                      <p className="mt-2 text-[24px] font-extrabold text-emerald-600 dark:text-emerald-400">89.2%</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] p-4 shadow-xs">
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Accreditation</p>
                      <p className="mt-2 text-[24px] font-extrabold text-blue-600 dark:text-indigo-400">Verified</p>
                    </div>
                  </div>
                )}

                {/* Admin Trainer Approval Queue */}
                {rawRole === 'admin' && pendingTrainers.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                        <UserCheck size={16} /> Pending Trainer Verification Queue ({pendingTrainers.length})
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Admin Clearance Required</span>
                    </div>

                    <div className="space-y-2">
                      {pendingTrainers.map((pt) => (
                        <div
                          key={pt.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{pt.name}</span>
                            <span className="text-slate-400 ml-2">• {pt.institution} ({pt.domain})</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveTrainer(pt.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                            >
                              Verify & Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Directory / Open Library Marketplace */}
                <div className="mt-9">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Marketplace & Open Library Hub
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Institutional course tracks with transparent faculty competency mapping.
                      </p>
                    </div>
                    {rawRole === 'trainer' && (
                      <button
                        onClick={() => setCreateModuleOpen(true)}
                        className="text-xs font-bold text-blue-600 dark:text-indigo-400 hover:underline"
                      >
                        + Add Track
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
                              {c.progress}% Completed
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-extrabold leading-snug">{c.title}</h3>
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold opacity-0 transition group-hover:opacity-100 bg-white/25 px-2 py-1 rounded-lg">
                            <Play size={10} fill="currentColor" /> Open Player
                          </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between grow space-y-4">
                          <div>
                            {/* Learner-Visible Trainer Competency Trigger */}
                            <button
                              onClick={() => {
                                const profile = TRAINER_PROFILES[c.instructor] || {
                                  name: c.instructor,
                                  designation: 'Certified Lead Instructor',
                                  institution: 'Capacity Connect Faculty Council',
                                  experienceYears: 6,
                                  rating: 4.8,
                                  verified: true,
                                  skills: ['Applied Pedagogy', 'Skill Telemetry', 'Cloud Engineering'],
                                  bio: 'Verified faculty member on the AcademiaEdu nationwide training network.',
                                  publishedCoursesCount: 3,
                                  accreditationPassRate: '92.5%',
                                };
                                setActiveTrainerProfile(profile);
                              }}
                              className="text-[11px] text-blue-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 group"
                            >
                              <span>Faculty: {c.instructor}</span>
                              <span className="text-[10px] text-slate-400 group-hover:text-blue-500">↗ (View Competency)</span>
                            </button>

                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                              {c.description}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {rawRole === 'trainee' && (
                              <button
                                onClick={() => handleToggleEnroll(c.id)}
                                className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition ${
                                  c.enrolled
                                    ? 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    : 'border-blue-600 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-300'
                                }`}
                              >
                                {c.enrolled ? 'Enrolled ✓' : 'Enroll +'}
                              </button>
                            )}
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
                  {rawRole === 'trainer' && (
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
                        ? 'Author questions and adjust passing score criteria.'
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
                          {a.questionsCount} Questions • {a.duration} • Passing Threshold: {a.passingScore}%
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
                  ({gradingResult.percentage}%) • Minimum Threshold: {activeQuizItem.passingScore}%
                </p>

                {gradingResult.passed ? (
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => {
                        setActiveCertModule(activeQuizItem.module);
                        setCertScore(gradingResult.percentage);
                        setActiveQuizItem(null);
                        setCertModalOpen(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <Award size={16} /> Mint Verifiable SHA-256 Certificate
                    </button>
                    <button
                      onClick={() => {
                        setActiveFeedbackCourse({ title: activeQuizItem.module, instructor: 'Prof. Aarav Mehta' });
                        setActiveQuizItem(null);
                        setFeedbackModalOpen(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Provide Learning Experience Feedback →
                    </button>
                  </div>
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
          course={activeViewerModule}
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

      {/* SIH Specified Feature Modals */}
      <TrainerProfileModal
        isOpen={!!activeTrainerProfile}
        trainer={activeTrainerProfile}
        onClose={() => setActiveTrainerProfile(null)}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        courseTitle={activeFeedbackCourse?.title || 'Technical Capacity Course'}
        trainerName={activeFeedbackCourse?.instructor || 'Prof. Aarav Mehta'}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmitFeedback={(fb) => console.log('Feedback registered into competency engine:', fb)}
      />

      <UploadResourceModal
        isOpen={uploadResourceOpen}
        courses={courses}
        onClose={() => setUploadResourceOpen(false)}
        onUpload={(res) => console.log('Resource asset published to S3/Cloudflare R2:', res)}
      />

      <AnnouncementsModal
        isOpen={announcementsModalOpen}
        onClose={() => setAnnouncementsModalOpen(false)}
        onBroadcast={(ann) => {
          setAnnouncements((prev) => [
            { id: Date.now(), title: ann.title, date: 'Today', author: displayName },
            ...prev,
          ]);
        }}
      />
    </div>
  );
};

export default Index;