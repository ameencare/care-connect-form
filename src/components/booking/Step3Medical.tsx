import { useMemo, useState } from "react";
import { OptionCard } from "./OptionCard";
import { NPRSSlider, classifyNPRS } from "./NPRSSlider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Bone,
  Activity,
  MessageCircle,
  Apple,
  Upload,
  FileCheck2,
  Edit3,
  CheckCircle2,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import type { BookingData, ServiceType } from "./types";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
}

type ConditionId = "pain" | "fracture" | "mobility" | "post_op" | "speech" | "nutrition";

interface Question {
  key: string;
  label: string;
  options: string[];
  section?: string;
}

const allConditions: { id: ConditionId; title: string; icon: React.ReactNode }[] = [
  { id: "pain", title: "ألم", icon: <AlertCircle className="h-6 w-6" /> },
  { id: "fracture", title: "إصابة / كسر", icon: <Bone className="h-6 w-6" /> },
  { id: "mobility", title: "ضعف أو صعوبة في الحركة", icon: <Activity className="h-6 w-6" /> },
  { id: "post_op", title: "بعد عملية جراحية", icon: <Stethoscope className="h-6 w-6" /> },
  { id: "speech", title: "مشكلة في النطق أو البلع", icon: <MessageCircle className="h-6 w-6" /> },
  { id: "nutrition", title: "مشكلة غذائية", icon: <Apple className="h-6 w-6" /> },
];

const serviceToConditions: Record<NonNullable<ServiceType>, ConditionId[]> = {
  physio: ["pain", "fracture", "mobility", "post_op"],
  occupational: ["pain", "fracture", "mobility", "post_op"],
  speech: ["speech"],
  nutrition: ["nutrition"],
};

const chronicQuestion: Question = {
  section: "السياق الطبي",
  key: "chronic",
  label: "هل لديك أمراض مزمنة؟",
  options: ["ارتفاع ضغط الدم", "السكري", "السمنة", "أمراض القلب", "الربو", "هشاشة العظام", "لا يوجد"],
};

const flow: Record<ConditionId, Question[]> = {
  pain: [
    { section: "خصائص العَرَض", key: "place", label: "مكان الألم", options: ["الظهر", "الرقبة", "الكتف", "الركبة", "أخرى"] },
    { key: "duration", label: "منذ متى تعاني من الألم؟", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { section: "السياق الطبي", key: "priorPT", label: "هل سبق لك العلاج الطبيعي لنفس المشكلة؟", options: ["نعم", "لا"] },
    chronicQuestion,
  ],
  fracture: [
    { key: "place", label: "مكان الإصابة", options: ["اليد", "الرجل", "الظهر", "الكتف", "أخرى"] },
    { key: "when", label: "وقت الإصابة", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "surgery", label: "هل تم إجراء عملية؟", options: ["نعم", "لا"] },
    { key: "movement", label: "مستوى الحركة الحالي", options: ["طبيعي", "محدود", "لا يستطيع الحركة"] },
    chronicQuestion,
  ],
  mobility: [
    { key: "issueType", label: "نوع المشكلة", options: ["ضعف عضلي", "مشكلة توازن", "صعوبة في المشي"] },
    { key: "since", label: "مدة الحالة", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "بمساعدة", "لا يستطيع المشي"] },
    { key: "aid", label: "استخدام أدوات مساعدة", options: ["كرسي متحرك", "عكاز", "مشاية", "لا يوجد"] },
    chronicQuestion,
  ],
  post_op: [
    { key: "surgeryType", label: "نوع العملية", options: ["ركبة", "ورك", "ظهر", "كتف", "أخرى"] },
    { key: "when", label: "متى تمت العملية", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "محدود", "لا يستطيع الحركة"] },
    chronicQuestion,
  ],
  speech: [
    { key: "mainIssue", label: "المشكلة الأساسية", options: ["صعوبة في الكلام", "صعوبة في البلع", "الاثنين"] },
    { key: "since", label: "متى بدأت المشكلة", options: ["أقل من شهر", "أكثر من شهر"] },
    { key: "severity", label: "شدة المشكلة", options: ["خفيفة", "متوسطة", "شديدة"] },
    { key: "impact", label: "التأثير", options: ["صعوبة في التواصل", "صعوبة في الأكل", "كلاهما"] },
    chronicQuestion,
  ],
  nutrition: [
    { key: "goal", label: "الهدف", options: ["زيادة وزن", "إنقاص وزن", "تنظيم غذائي"] },
    chronicQuestion,
    { key: "adherence", label: "الالتزام الغذائي", options: ["منتظم", "غير منتظم"] },
    { key: "duration", label: "مدة المشكلة", options: ["أقل من شهر", "أكثر من شهر"] },
  ],
};

const durationMap: Record<string, string> = {
  "أقل من أسبوع": "حاد",
  "من أسبوع إلى أقل من شهر": "حاد",
  "من شهر إلى 3 أشهر": "شبه حاد",
  "أكثر من 3 أشهر": "مزمن",
};

interface SummaryData {
  title: string;
  items: { label: string; value: string }[];
}

const problemTitleMap: Record<ConditionId, string> = {
  pain: "ألم",
  fracture: "إصابة / كسر",
  mobility: "ضعف أو صعوبة في الحركة",
  post_op: "بعد عملية جراحية",
  speech: "مشكلة في النطق أو البلع",
  nutrition: "مشكلة غذائية",
};

function buildSummary(d: BookingData): SummaryData | null {
  const p = d.medical.problem as ConditionId | undefined;
  if (!p) return null;
  const qs = flow[p];
  const items = qs
    .filter((q) => d.medical[q.key])
    .map((q) => ({ label: q.label, value: d.medical[q.key] }));
  return { title: problemTitleMap[p], items };
}

type ExpertiseLevel = "junior" | "senior" | "expert";

interface Recommendation {
  level: ExpertiseLevel;
  title: string;
  reason: string;
}

const expertiseTitle: Record<ExpertiseLevel, string> = {
  junior: "أخصائي متوسط الخبرة (Junior)",
  senior: "أخصائي عالي الخبرة (Senior)",
  expert: "أخصائي خبير (Expert)",
};

function recommendExpertise(d: BookingData): Recommendation | null {
  const p = d.medical.problem as ConditionId | undefined;
  if (!p) return null;
  const m = d.medical;
  const reasons: string[] = [];
  let score = 0;

  // Chronicity / duration
  const durationKey = m.duration || m.when || m.since;
  if (durationKey) {
    const phase = durationMap[durationKey];
    if (phase === "مزمن") {
      score += 2;
      reasons.push("الحالة مزمنة");
    } else if (phase === "شبه حاد") {
      score += 1;
      reasons.push("الحالة شبه حادة");
    }
  }

  // Mobility / severity
  if (m.movement === "لا يستطيع الحركة" || m.movement === "لا يستطيع المشي") {
    score += 2;
    reasons.push("ضعف شديد في الحركة");
  } else if (m.movement === "محدود" || m.movement === "بمساعدة") {
    score += 1;
    reasons.push("حركة محدودة");
  }

  if (m.severity === "شديدة") {
    score += 2;
    reasons.push("شدة عالية");
  } else if (m.severity === "متوسطة") {
    score += 1;
    reasons.push("شدة متوسطة");
  }

  // Surgery / post-op
  if (p === "post_op" || m.surgery === "نعم") {
    score += 2;
    reasons.push("حالة ما بعد عملية جراحية");
  }

  // Prior PT failed to resolve
  if (m.priorPT === "نعم") {
    score += 1;
    reasons.push("سبق علاج طبيعي لنفس المشكلة");
  }

  // Aids
  if (m.aid && m.aid !== "لا يوجد") {
    score += 1;
    reasons.push("يستخدم أداة مساعدة");
  }

  // Chronic comorbidities
  if (m.chronic && m.chronic !== "لا يوجد") {
    score += 1;
    reasons.push(`وجود مرض مزمن (${m.chronic})`);
  }

  let level: ExpertiseLevel = "junior";
  if (score >= 4) level = "expert";
  else if (score >= 2) level = "senior";

  const reason = reasons.length
    ? reasons.join("، ")
    : "حالة عامة تحتاج دعماً أولياً";

  return { level, title: expertiseTitle[level], reason };
}

export function Step3Medical({ data, update, confirmed, setConfirmed }: Props) {
  const service = data.service;
  const availableIds = service ? serviceToConditions[service] : [];
  const conditions = allConditions.filter((c) => availableIds.includes(c.id));

  const problem = data.medical.problem as ConditionId | undefined;
  const problemValid = problem && availableIds.includes(problem);
  const questions = problemValid ? flow[problem!] : [];
  const requiresAttachment = problem === "fracture" || problem === "post_op";
  const attachmentOk = !requiresAttachment || !!data.attachmentName;
  const allAnswered = questions.length > 0 && questions.every((q) => data.medical[q.key]) && attachmentOk;
  const summary = useMemo(() => buildSummary(data), [data]);
  const recommendation = useMemo(() => recommendExpertise(data), [data]);
  const [fileName, setFileName] = useState<string | undefined>(data.attachmentName);

  const setAnswer = (key: string, value: string) => {
    update({ medical: { ...data.medical, [key]: value } });
    setConfirmed(false);
  };

  if (service && conditions.length === 1 && problem !== conditions[0].id) {
    update({ medical: { problem: conditions[0].id } });
  }

  if (!service) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center">
        <p className="text-muted-foreground">يرجى اختيار الخدمة أولاً من الخطوة السابقة.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">حدد حالتك الصحية</h2>
        <p className="mt-1 text-muted-foreground">ما هي مشكلتك الرئيسية؟</p>
      </div>

      {conditions.length > 1 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {conditions.map((p) => (
            <OptionCard
              key={p.id}
              selected={problem === p.id}
              onClick={() => {
                update({ medical: { problem: p.id } });
                setConfirmed(false);
              }}
              title={p.title}
              icon={p.icon}
              compact
            />
          ))}
        </div>
      )}

      {questions.map((q, idx) => {
        const showSection = q.section && (idx === 0 || questions[idx - 1].section !== q.section);
        return (
          <div key={q.key} className="space-y-3">
            {showSection && (
              <div className="flex items-center gap-2 pt-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{q.section}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-3">
              <Label className="text-base font-semibold">{q.label}</Label>
              {q.options.length === 0 && q.key === "severity" ? (
                <NPRSSlider
                  value={data.medical[q.key]}
                  onChange={(v) => setAnswer(q.key, v)}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const active = data.medical[q.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(q.key, opt)}
                        className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                          active
                            ? "border-primary bg-gradient-brand text-white shadow-soft"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {(problem === "fracture" || problem === "post_op") && (
        <div className="animate-in fade-in space-y-2">
          <Label className="text-sm font-semibold">
            إرفاق تقرير طبي <span className="text-destructive">(إلزامي)</span>
          </Label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition ${fileName ? "border-primary/50 bg-secondary/50" : "border-destructive/50 bg-destructive/5 hover:border-destructive"}`}>
            {fileName ? <FileCheck2 className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">
              {fileName || "اضغط لاختيار ملف"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFileName(f.name);
                  update({ attachmentName: f.name });
                }
              }}
            />
          </label>
        </div>
      )}

      {allAnswered && summary && (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-accent/40 to-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
            <CheckCircle2 className="h-5 w-5" />
            الملخص السريري
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <Stethoscope className="h-4 w-4" />
            {summary.title}
          </div>

          <ul className="space-y-2">
            {summary.items.map((it) => (
              <li
                key={it.label}
                className="flex items-start gap-2 rounded-xl bg-card/60 px-3 py-2 text-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground">{it.label}</span>
                  <span className="font-semibold text-foreground">{it.value}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2">
            <Label htmlFor="medicalNote" className="text-sm font-semibold">
              ملاحظات إضافية (اختياري)
            </Label>
            <Textarea
              id="medicalNote"
              value={data.medicalNote ?? ""}
              onChange={(e) => {
                update({ medicalNote: e.target.value });
                setConfirmed(false);
              }}
              placeholder="اكتب أي تفاصيل إضافية من المريض أو المرافق هنا..."
              className="min-h-[88px] rounded-xl bg-card"
            />
          </div>

          {recommendation && (
            <div className="mt-4 rounded-2xl border-2 border-primary/40 bg-primary/5 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                التلميح: مستوى الخبرة المقترح
              </div>
              <div className="text-base font-bold text-foreground">
                {recommendation.title}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                بناءً على: {recommendation.reason}.
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                يمكنك تعديل اختيارك في الخطوة التالية.
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => setConfirmed(true)}
              className="bg-gradient-brand text-white hover:opacity-90"
            >
              <CheckCircle2 className="ml-2 h-4 w-4" />
              تأكيد الحالة
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                update({ medical: { problem: problem! }, medicalNote: "" });
                setConfirmed(false);
              }}
            >
              <Edit3 className="ml-2 h-4 w-4" />
              تعديل الإجابات
            </Button>
            {confirmed && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> تم التأكيد
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
