import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Users,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { UserProfile } from "@/context/AuthContext";

interface AnalyticsViewProps {
  user: UserProfile | null;
  onViewCertificate: (moduleTitle: string, score: number) => void;
}

const traineeCompetencies = [
  { skill: "REST & Async API Protocols", mastery: 94, status: "Advanced" },
  { skill: "Role-Based Access Control (RBAC)", mastery: 88, status: "Proficient" },
  { skill: "Data Modeling & PostgreSQL Relations", mastery: 72, status: "Intermediate" },
  { skill: "Cryptographic Certificate Signing", mastery: 85, status: "Proficient" },
  { skill: "State Management & Caching", mastery: 64, status: "Intermediate" },
];

const cohortPerformance = [
  { module: "Digital Literacy Foundations", enrolled: 142, avgScore: 91, passRate: 96 },
  { module: "Community Engagement & Outreach", enrolled: 118, avgScore: 84, passRate: 88 },
  { module: "Data-Informed Decision Making", enrolled: 95, avgScore: 78, passRate: 81 },
];

export function AnalyticsView({ user, onViewCertificate }: AnalyticsViewProps) {
  const role = user?.role || "Trainee";
  const [activeRange, setActiveRange] = useState<"7d" | "30d" | "all">("30d");

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">
            {role === "Trainer" ? "Cohort Performance & Assessment Telemetry" : "Competency Analytics & Accreditation"}
          </h2>
          <p className="section-subtitle">
            {role === "Trainer"
              ? "Real-time evaluation yields and curriculum drop-off metrics."
              : "Verifiable skill proficiencies evaluated by automated grading endpoints."}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(["7d", "30d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeRange === range
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {range === "7d" ? "Past 7 Days" : range === "30d" ? "Past 30 Days" : "Cumulative"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">
              {role === "Trainer" ? "Active Trainees Evaluated" : "Evaluations Completed"}
            </span>
            <div className="stat-icon blue">
              <Users size={17} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-950">{role === "Trainer" ? "355" : "18"}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp size={12} /> +14% vs last cycle
          </span>
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Mean Assessment Score</span>
            <div className="stat-icon green">
              <BarChart3 size={17} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-950">88.4%</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp size={12} /> +3.2% benchmark
          </span>
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">
              {role === "Trainer" ? "Certificates Endorsed" : "Credentials Earned"}
            </span>
            <div className="stat-icon violet">
              <Award size={17} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-950">{role === "Trainer" ? "312" : "3"}</p>
          <span className="mt-1 text-[10px] font-medium text-slate-400">Cryptographically Signed</span>
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">
              {role === "Trainer" ? "Cohort Retention" : "Learning Consistency"}
            </span>
            <div className="stat-icon orange">
              <Clock size={17} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-950">{role === "Trainer" ? "92.6%" : "6 Days"}</p>
          <span className="mt-1 text-[10px] font-medium text-slate-400">
            {role === "Trainer" ? "Low drop-off" : "Active study streak"}
          </span>
        </div>
      </div>

      {role !== "Trainer" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="surface-card p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Skill Competency Matrix</h3>
                <p className="text-[11px] text-slate-500">Auto-calculated from assessment question categories</p>
              </div>
              <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-blue-700">
                Tier: High Proficiency
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {traineeCompetencies.map((item) => (
                <div key={item.skill}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-400">{item.status}</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{item.mastery}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.mastery >= 85
                          ? "bg-blue-600"
                          : item.mastery >= 70
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card flex flex-col justify-between p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Telemetry Engine
                </span>
                <Sparkles size={16} className="text-blue-600" />
              </div>
              <h3 className="mt-2 text-base font-extrabold text-slate-950">Evaluation Velocity</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                You are outperforming <span className="font-bold text-slate-800">84%</span> of peers across your
                institution cohort in modular checkpoint timing.
              </p>

              <div className="mt-6 flex h-24 items-end gap-2 border-b border-slate-100 pb-2">
                {[45, 60, 30, 80, 70, 95, 88].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        idx === 6 ? "bg-blue-600" : "bg-slate-200 hover:bg-slate-300"
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span className="font-bold text-blue-600">Today</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50/70 p-3.5 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <p className="font-extrabold">Next Milestone: Lead Specialist</p>
                <p className="text-[10px] text-blue-700">Complete 1 more test at 80%+</p>
              </div>
              <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
            </div>
          </div>

          <div className="surface-card p-6 lg:col-span-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Issued Cryptographic Credentials</h3>
                <p className="text-[11px] text-slate-500">
                  Select any credential to view official cryptographic hashes or print PDF certificates.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Digital Literacy Foundations", score: 94, hash: "CC-2026-VAL-01-A99" },
                { title: "Community Engagement & Outreach", score: 88, hash: "CC-2026-VAL-02-B42" },
                { title: "Data-Informed Decision Making", score: 82, hash: "CC-2026-VAL-03-K11" },
              ].map((cert) => (
                <div
                  key={cert.hash}
                  onClick={() => onViewCertificate(cert.title, cert.score)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="font-mono text-xs font-extrabold text-emerald-600">{cert.score}% PASS</span>
                  </div>
                  <h4 className="mt-3 text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                    {cert.title}
                  </h4>
                  <p className="mt-1 font-mono text-[9px] text-slate-400">{cert.hash}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-bold text-blue-600">
                    <span>Inspect Signature</span>
                    <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {role === "Trainer" && (
        <div className="surface-card overflow-hidden">
          <div className="border-b border-slate-100 p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Module Cohort Breakdown</h3>
              <p className="text-[11px] text-slate-500">Aggregated student evaluation stats across your active courses.</p>
            </div>
            <button className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <Download size={14} /> Export CSV Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 font-bold uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="px-5 py-3">Module Curriculum</th>
                  <th className="px-5 py-3">Enrolled Students</th>
                  <th className="px-5 py-3">Average Score</th>
                  <th className="px-5 py-3">Pass Rate</th>
                  <th className="px-5 py-3">Intervention Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cohortPerformance.map((c) => (
                  <tr key={c.module} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-bold text-slate-900">{c.module}</td>
                    <td className="px-5 py-4">{c.enrolled} trainees</td>
                    <td className="px-5 py-4 font-mono font-bold text-blue-600">{c.avgScore}%</td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-600">{c.passRate}%</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                          c.passRate >= 90
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {c.passRate >= 90 ? "Optimal Yield" : "Standard Variance"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsView;
