import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileQuestion,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Play,
  Plus,
  PlusCircle,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { CreateModuleModal } from "@/components/CreateModuleModal";
import { CreateQuizModal } from "@/components/CreateQuizModal";
import { CourseViewerModal } from "@/components/CourseViewerModal";
import { CertificateModal } from "@/components/CertificateModal";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";
import { AdminConsole } from "@/components/AdminConsole";
import { AnalyticsView } from "@/components/AnalyticsView";
import { api } from "@/lib/api";

type Tab = "overview" | "learning" | "assessments" | "progress";

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
    title: "Digital Literacy Foundations",
    type: "Core module",
    instructor: "Prof. Aarav Mehta",
    lessons: "8 of 12 lessons",
    color: "from-blue-600 to-indigo-500",
  },
  {
    id: 2,
    title: "Community Engagement & Outreach",
    type: "Professional skills",
    instructor: "Dr. Nia Okafor",
    lessons: "5 of 10 lessons",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: 3,
    title: "Data-Informed Decision Making",
    type: "Core module",
    instructor: "Liam Chen",
    lessons: "3 of 14 lessons",
    color: "from-violet-500 to-fuchsia-500",
  },
];

const defaultAssessments: AssessmentItem[] = [
  {
    id: "quiz-1",
    title: "Digital Literacy Checkpoint",
    module: "Digital Literacy Foundations",
    questionsCount: 3,
    passingScore: 60,
    duration: "15 min",
    questions: [
      {
        q: "Which data structure operates on a First-In-First-Out (FIFO) principle?",
        options: ["Stack", "Queue", "Binary Tree", "Hash Map"],
        correct: 1,
      },
      {
        q: "What does RBAC stand for in modern cloud authorization architecture?",
        options: [
          "Role-Based Access Control",
          "Rule-Based Action Call",
          "Remote Basic Auth Channel",
          "Route-Bound Access Cache",
        ],
        correct: 0,
      },
      {
        q: "What is the primary architectural benefit of FastAPI's async execution?",
        options: [
          "Automatic CSS bundling",
          "Non-blocking concurrent I/O throughput",
          "Client-side compilation",
          "Local storage encryption",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Community Mapping Evaluation",
    module: "Community Engagement & Outreach",
    questionsCount: 2,
    passingScore: 50,
    duration: "10 min",
    questions: [
      {
        q: "What is the primary objective of community asset mapping?",
        options: [
          "Identifying local skills, institutions, and community strengths",
          "Conducting legal property surveys",
          "Automating server load balancing",
          "Replacing municipal databases",
        ],
        correct: 0,
      },
      {
        q: "Which stakeholder engagement method produces highest grassroots feedback yield?",
        options: [
          "Anonymous cold surveys",
          "Participatory Action Research (PAR)",
          "Unilateral administrative notices",
          "Third-party advertising",
        ],
        correct: 1,
      },
    ],
  },
];

export default function Index() {
  const { user, logout, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Data Stores
  const [courses, setCourses] = useState(defaultCourses);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(defaultAssessments);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Modals & Panels
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCertModule, setActiveCertModule] = useState("");
  const [certScore, setCertScore] = useState(100);

  // Lesson Viewer Modal State
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

  useEffect(() => {
    api
      .getCourses()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) setCourses(data);
      })
      .catch(() => console.log("Serving cached course directory."));
  }, []);

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

  const handleQuizSubmit = async () => {
    if (!activeQuizItem) return;
    setLoadingSubmission(true);

    try {
      const res = await api.submitAssessment(activeQuizItem.id, { answers: selectedAnswers });
      setGradingResult({
        score: res.score,
        total: res.total,
        percentage: res.percentage,
        passed: res.passed,
      });
    } catch {
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
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handleCreateQuiz = (newQuiz: any) => {
    const formatted: AssessmentItem = {
      id: newQuiz.id,
      title: newQuiz.title,
      module: newQuiz.title,
      questionsCount: newQuiz.questions.length,
      passingScore: newQuiz.passingScore,
      duration: `${newQuiz.questions.length * 5} min`,
      questions: newQuiz.questions,
    };
    setAssessmentsList((prev) => [formatted, ...prev]);
  };

  const filteredCourses = useMemo(
    () => courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [courses, query]
  );

  const role = user?.role || "Trainee";

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-4 sm:px-7 lg:px-10">
          <button
            className="mr-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="brand-mark">
              <span />
              <span />
              <span />
            </div>
            <div>
              <p className="text-[15px] font-extrabold tracking-tight text-slate-950">
                capacity<span className="text-blue-600">connect</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                learn • grow • lead
              </p>
            </div>
          </div>

          <div className="relative ml-4 hidden max-w-[370px] flex-1 md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules, skills, or curriculum..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-1.5 pr-3 shadow-xs hover:bg-slate-50 transition"
                >
                  <div
                    className={`avatar ${
                      role === "Admin" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <span className="block text-xs font-bold text-slate-900 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400 leading-tight">
                      <span
                        className={`font-semibold ${
                          role === "Admin" ? "text-amber-600" : "text-blue-600"
                        }`}
                      >
                        {role}
                      </span>
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 ml-1" />
                </button>

                {/* USER PROFILE DROPDOWN */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <div className="p-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <p className="mt-1 text-[9px] font-mono font-bold text-blue-600 truncate">
                        {user.institution}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Settings2 size={15} /> Institutional Profile
                    </button>
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
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <LogIn size={15} /> Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* SIDEBAR */}
        <aside
          className={`${
            mobileNav ? "fixed inset-y-[72px] left-0 z-20 flex" : "hidden"
          } w-[250px] shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:sticky lg:top-[72px] lg:flex lg:h-[calc(100vh-72px)] lg:flex-col`}
        >
          {user && (
            <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                {role === "Admin" ? "System Clearance" : "Authenticated Registry"}
              </p>
              <p className="mt-1 text-xs font-extrabold text-slate-900 truncate">{user.fullName}</p>
              <p className="mt-0.5 text-[10px] text-slate-500 truncate">{user.departmentOrStandard}</p>
              <p className="mt-1 text-[9px] font-mono text-slate-400 truncate">
                ID: {user.identityNumber || "AUTH-ROOT"}
              </p>
            </div>
          )}

          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setTab("overview");
                setMobileNav(false);
              }}
              className={`nav-item ${tab === "overview" ? "nav-active" : ""}`}
            >
              <LayoutDashboard size={17} />
              {role === "Admin" ? "Governance Hub" : "Overview"}
            </button>

            {role !== "Admin" && (
              <>
                <button
                  onClick={() => {
                    setTab("learning");
                    setMobileNav(false);
                  }}
                  className={`nav-item ${tab === "learning" ? "nav-active" : ""}`}
                >
                  <BookOpen size={17} />
                  {role === "Trainer" ? "Curriculum Studio" : "My Learning"}
                </button>
                <button
                  onClick={() => {
                    setTab("assessments");
                    setMobileNav(false);
                  }}
                  className={`nav-item ${tab === "assessments" ? "nav-active" : ""}`}
                >
                  <FileCheck2 size={17} />
                  {role === "Trainer" ? "Assessment Studio" : "Assessments"}
                </button>
                <button
                  onClick={() => {
                    setTab("progress");
                    setMobileNav(false);
                  }}
                  className={`nav-item ${tab === "progress" ? "nav-active" : ""}`}
                >
                  <BarChart3 size={17} />
                  {role === "Trainer" ? "Cohort Telemetry" : "Analytics & Badges"}
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto rounded-2xl bg-[#0b1736] p-4 text-white">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
              <Sparkles size={16} />
            </div>
            <p className="text-xs font-bold">{role} Domain Active</p>
            <p className="mt-1 text-[10px] text-slate-400">Mutual exclusivity enforced by RBAC.</p>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1120px]">
            {/* HERO BAR */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                      role === "Admin"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {role} Console
                  </span>
                  <span className="text-xs font-medium text-slate-400">• {user?.institution}</span>
                </div>
                <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-950 sm:text-[32px]">
                  {role === "Trainee" && `Welcome back, ${user?.fullName.split(" ")[0]}!`}
                  {role === "Trainer" && `Educator Workspace • ${user?.fullName}`}
                  {role === "Admin" && "Central Governance & Accreditation Portal"}
                </h1>
              </div>

              {role === "Trainer" && (
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

            {/* CONDITIONAL RENDER: ADMIN CONSOLE VS STANDARD VIEWS */}
            {role === "Admin" ? (
              <AdminConsole />
            ) : (
              <>
                {/* TAB: OVERVIEW */}
                {tab === "overview" && (
                  <>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                      <div className="surface-card p-4">
                        <p className="text-[12px] font-medium text-slate-500">
                          {role === "Trainer" ? "Published Modules" : "Enrolled Modules"}
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-900">{courses.length}</p>
                      </div>
                      <div className="surface-card p-4">
                        <p className="text-[12px] font-medium text-slate-500">
                          {role === "Trainer" ? "Active Checkpoints" : "Assessments Done"}
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-900">
                          {role === "Trainer" ? assessmentsList.length : "18"}
                        </p>
                      </div>
                      <div className="surface-card p-4">
                        <p className="text-[12px] font-medium text-slate-500">Average Performance</p>
                        <p className="mt-2 text-[24px] font-extrabold text-emerald-600">89.2%</p>
                      </div>
                      <div className="surface-card p-4">
                        <p className="text-[12px] font-medium text-slate-500">Accreditation</p>
                        <p className="mt-2 text-[24px] font-extrabold text-blue-600">Verified</p>
                      </div>
                    </div>

                    <div className="mt-9">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="section-title">Institutional Course Library</h2>
                          <p className="section-subtitle">
                            Accredited curricula available under your institutional scope.
                          </p>
                        </div>
                        {role === "Trainer" && (
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
                            className="surface-card overflow-hidden transition hover:shadow-lg"
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
                {tab === "learning" && (
                  <div className="surface-card p-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="section-title">
                          {role === "Trainer" ? "Curriculum Asset Management" : "My Enrolled Curriculum"}
                        </h2>
                        <p className="section-subtitle">
                          Full course materials, implementation code blueprints, and lecture notes.
                        </p>
                      </div>
                      {role === "Trainer" && (
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
                {tab === "assessments" && (
                  <div className="surface-card p-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="section-title">
                          {role === "Trainer" ? "Question Bank & Assessment Studio" : "Automated Evaluation Engine"}
                        </h2>
                        <p className="section-subtitle">
                          {role === "Trainer"
                            ? "Author questions and adjust pass criteria."
                            : "Instant test evaluation with tamper-resistant validation."}
                        </p>
                      </div>
                      {role === "Trainer" && (
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
                            {role === "Trainer" ? "Preview Checkpoint" : "Start Test"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: PROGRESS */}
                {tab === "progress" && (
                  <AnalyticsView
                    user={user}
                    onViewCertificate={(modTitle, score) => {
                      setActiveCertModule(modTitle);
                      setCertScore(score);
                      setCertModalOpen(true);
                    }}
                  />
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
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
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
                      {loadingSubmission ? "Evaluating..." : "Submit to Grading Engine"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <CheckCircle2
                  className={`mx-auto ${
                    gradingResult.passed ? "text-emerald-500" : "text-amber-500"
                  }`}
                  size={48}
                />
                <h3 className="mt-3 text-lg font-extrabold text-slate-950">
                  {gradingResult.passed ? "Assessment Passed!" : "Threshold Not Reached"}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Score:{" "}
                  <span
                    className={`font-extrabold ${
                      gradingResult.passed ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {gradingResult.score} / {gradingResult.total}
                  </span>{" "}
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
              You are signed in as <span className="font-semibold text-slate-800">{user?.fullName}</span> ({user?.role}).
              Signing out will invalidate your local session token and require credentials to sign in again.
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

      {/* MODAL MOUNTS */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ProfileSettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      <CreateModuleModal
        isOpen={createModuleOpen}
        onClose={() => setCreateModuleOpen(false)}
        onCreated={(newMod) => setCourses((prev) => [newMod, ...prev])}
      />
      <CreateQuizModal
        isOpen={createQuizOpen}
        onClose={() => setCreateQuizOpen(false)}
        onSave={handleCreateQuiz}
      />
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
        moduleName={activeCertModule}
        scorePercentage={certScore}
      />
      <CourseViewerModal
        isOpen={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
        course={selectedCourseForViewer}
        onLaunchAssessment={startAssessment}
      />
    </div>
  );
}