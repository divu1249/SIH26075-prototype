import { useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  FileText,
  ArrowRight,
  BookOpen,
  Code,
  Sparkles,
} from "lucide-react";

interface CourseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    instructor: string;
    type?: string;
    lessons?: string;
  } | null;
  onLaunchAssessment: (moduleTitle: string) => void;
}

const sampleLessons = [
  {
    id: 1,
    title: "1. Architecture Overview & Core Foundations",
    duration: "12 min read",
    type: "Theory & Framework",
    content:
      "This foundational unit explores how decentralized educational capacity networks operate. We examine peer-to-peer verification protocols, role-based access boundaries, and the necessity of tamper-resistant credential generation.",
    keyTakeaways: [
      "Role-Based Access Control (RBAC) enforces strict Trainee vs. Trainer boundaries.",
      "FastAPI handles asynchronous endpoint routing for non-blocking I/O.",
      "Evaluation engines must validate scoring server-side to prevent client spoofing.",
    ],
    codeSnippet: `@app.post("/verify")\nasync def verify_credential(token: str = Depends(oauth2_scheme)):\n    payload = decode_jwt(token)\n    return {"status": "authenticated", "scope": payload.get("role")}`,
  },
  {
    id: 2,
    title: "2. Hands-on Implementation & Modular Checkpoints",
    duration: "18 min read",
    type: "Practical Workshop",
    content:
      "In this section, trainees inspect real-world API handshakes, cryptographic signature hashing, and database persistence layers. Review the code sample below to inspect how authorization claims are validated.",
    keyTakeaways: [
      "Token expiry must be deterministically signed using SHA-256 HMAC keys.",
      "Local state synchronizes with PostgreSQL via TanStack Query caching.",
    ],
    codeSnippet: `const { data, error } = await api.submitAssessment(moduleId, {\n  answers: selectedAnswers,\n  timestamp: Date.now()\n});`,
  },
  {
    id: 3,
    title: "3. Capstone Evaluation & Competency Synthesis",
    duration: "5 min prep",
    type: "Checkpoint Prep",
    content:
      "You have completed all prerequisite study materials. You are now authorized to initiate the timed evaluation checkpoint. Scoring 60% or higher generates your tamper-resistant credential signature.",
    keyTakeaways: [
      "Ensure an uninterrupted connection before launching the test.",
      "Instant grading will record your completion to the institutional audit log.",
    ],
    codeSnippet: `// Ready for evaluation. Proceed to checkpoint.`,
  },
];

export function CourseViewerModal({
  isOpen,
  onClose,
  course,
  onLaunchAssessment,
}: CourseViewerModalProps) {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);

  if (!isOpen || !course) return null;

  const currentLesson = sampleLessons[activeLessonIdx];

  const handleMarkComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
    if (activeLessonIdx < sampleLessons.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 backdrop-blur-md">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-blue-700">
                  {course.type || "Interactive Curriculum"}
                </span>
                <span className="text-[11px] text-slate-400">• Lead Faculty: {course.instructor}</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-950">{course.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto">
            <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Module Curriculum ({completedLessons.length}/{sampleLessons.length} Done)
            </p>

            <div className="mt-3 space-y-2">
              {sampleLessons.map((l, idx) => {
                const isCurrent = activeLessonIdx === idx;
                const isDone = completedLessons.includes(l.id);

                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLessonIdx(idx)}
                    className={`w-full rounded-2xl p-3 text-left transition border ${
                      isCurrent
                        ? "border-blue-600 bg-white shadow-sm ring-2 ring-blue-500/10"
                        : "border-slate-200/70 bg-white/70 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase text-blue-600">{l.type}</span>
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">{l.duration}</span>
                      )}
                    </div>
                    <p
                      className={`mt-1 text-xs font-bold leading-snug ${
                        isCurrent ? "text-slate-950" : "text-slate-700"
                      }`}
                    >
                      {l.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles size={16} />
                <p className="text-xs font-extrabold">Ready to evaluate?</p>
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                Take the checkpoint quiz now to verify your understanding.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onLaunchAssessment(course.title);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Launch Checkpoint <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <span>Lesson {activeLessonIdx + 1} of {sampleLessons.length}</span>
                <span>•</span>
                <span>{currentLesson.duration}</span>
              </div>

              <h1 className="mt-2 text-2xl font-extrabold text-slate-950">{currentLesson.title}</h1>

              <div className="mt-5 flex h-48 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-slate-900/60" />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition group-hover:scale-110">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">Interactive Lecture & Walkthrough Preview</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Core Content</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{currentLesson.content}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-600" />
                  Key Takeaways
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {currentLesson.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code size={14} /> Implementation Blueprint
                </h3>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-200">
                  {currentLesson.codeSnippet}
                </pre>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                  disabled={activeLessonIdx === 0}
                  onClick={() => setActiveLessonIdx((prev) => prev - 1)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  Previous Unit
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleMarkComplete(currentLesson.id)}
                    className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    <CheckCircle2 size={15} />
                    {activeLessonIdx === sampleLessons.length - 1 ? "Finish Curriculum" : "Complete & Next"}
                  </button>

                  {activeLessonIdx === sampleLessons.length - 1 && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchAssessment(course.title);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      Start Final Assessment <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CourseViewerModal;
export { CourseViewerModal };