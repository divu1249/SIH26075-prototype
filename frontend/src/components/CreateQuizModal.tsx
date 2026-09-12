import { useState } from "react";
import { X, Plus, Trash2, HelpCircle, Award } from "lucide-react";

interface QuestionDraft {
  q: string;
  options: string[];
  correct: number;
}

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quizData: any) => void;
}

export function CreateQuizModal({ isOpen, onClose, onSave }: CreateQuizModalProps) {
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      q: "",
      options: ["", "", "", ""],
      correct: 0,
    },
  ]);

  if (!isOpen) return null;

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === qIndex
          ? {
              ...item,
              options: item.options.map((opt, oi) => (oi === optIndex ? val : opt)),
            }
          : item
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        q: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `quiz-${Date.now()}`,
      title,
      passingScore,
      questions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
              Trainer Assessment Studio
            </span>
            <h2 className="text-xl font-extrabold text-slate-950">Author Evaluation Checkpoint</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-600">Checkpoint Assessment Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus & Tokenomics"
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Passing Grade (%)</label>
              <input
                type="number"
                min={30}
                max={100}
                required
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 relative">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <HelpCircle size={15} className="text-blue-600" />
                    Question {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Delete Question"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={q.q}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, i) => (i === qIdx ? { ...item, q: e.target.value } : item))
                    )
                  }
                  placeholder="Enter the conceptual question prompt..."
                  className="mt-2.5 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
                />

                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Define Options (Select radio to designate correct answer)
                  </p>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correct === optIdx}
                        onChange={() =>
                          setQuestions((prev) =>
                            prev.map((item, i) => (i === qIdx ? { ...item, correct: optIdx } : item))
                          )
                        }
                        className="h-4 w-4 text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        className={`h-8 flex-1 rounded-lg border px-3 text-xs outline-none transition ${
                          q.correct === optIdx
                            ? "border-emerald-400 bg-emerald-50/30 font-semibold text-emerald-900"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Plus size={15} /> Add Another Question
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Award size={15} /> Publish Checkpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}