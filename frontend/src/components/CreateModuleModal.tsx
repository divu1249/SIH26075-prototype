import { useState } from "react";
import { X, Plus, BookOpen, FileText } from "lucide-react";
import { api } from "@/lib/api";

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newModule: any) => void;
}

export function CreateModuleModal({ isOpen, onClose, onCreated }: CreateModuleModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Core Module");
  const [instructor, setInstructor] = useState("");
  const [lessons, setLessons] = useState("6 lessons");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newModule = {
      id: Date.now(),
      title,
      type,
      instructor: instructor || "Faculty Lead",
      lessons,
      description,
      progress: 0,
      color: "from-blue-600 to-cyan-500",
    };

    try {
      await api.createCourse(newModule);
    } catch {
      console.log("Saving module to client state cache.");
    } finally {
      onCreated(newModule);
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Educator Studio</span>
            <h2 className="text-xl font-extrabold text-slate-950">Publish Curriculum Module</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600">Module / Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Asynchronous Microservices with FastAPI"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600">Curriculum Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500"
              >
                <option>Core Module</option>
                <option>Professional Skills</option>
                <option>Advanced Specialization</option>
                <option>Open Community Resource</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Total Lessons / Units</label>
              <input
                type="text"
                required
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="e.g. 10 lessons (4 hrs)"
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600">Lead Faculty / Instructor Name</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Ramesh Gupta"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600">Course Syllabus & Overview</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the core learning outcomes, lecture notes, and assessment checkpoints..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-center">
            <FileText className="mx-auto text-slate-400" size={24} />
            <p className="mt-1 text-xs font-bold text-slate-700">Attach Resource PDFs & Trial Media</p>
            <p className="text-[10px] text-slate-400">Supported formats: PDF, MP4 previews (Max 50MB)</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={16} /> {submitting ? "Publishing..." : "Publish to Course Directory"}
          </button>
        </form>
      </div>
    </div>
  );
}