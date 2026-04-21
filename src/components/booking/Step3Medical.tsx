import { useMemo, useState } from "react";
import { OptionCard } from "./OptionCard";
import { NPRSSlider, classifyNPRS } from "./NPRSSlider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

const flow: Record<ConditionId, Question[]> = {
  pain: [
    { section: "خصائص العَرَض", key: "place", label: "مكان الألم", options: ["الظهر", "الرقبة", "الكتف", "الركبة", "أخرى"] },
    { key: "duration", label: "منذ متى تعاني من الألم؟", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { section: "التأثير الوظيفي", key: "impact", label: "هل يؤثر على الأنشطة اليومية؟", options: ["لا يؤثر", "يؤثر بشكل بسيط", "يؤثر بشكل كبير"] },
    { section: "السياق الطبي", key: "priorPT", label: "هل سبق لك العلاج الطبيعي لنفس المشكلة؟", options: ["نعم", "لا"] },
  ],
  fracture: [
    { key: "place", label: "مكان الإصابة", options: ["اليد", "الرجل", "الظهر", "الكتف", "أخرى"] },
    { key: "when", label: "وقت الإصابة", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "surgery", label: "هل تم إجراء عملية؟", options: ["نعم", "لا"] },
    { key: "movement", label: "مستوى الحركة الحالي", options: ["طبيعي", "محدود", "لا يستطيع الحركة"] },
  ],
  mobility: [
    { key: "issueType", label: "نوع المشكلة", options: ["ضعف عضلي", "مشكلة توازن", "صعوبة في المشي"] },
    { key: "since", label: "مدة الحالة", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "بمساعدة", "لا يستطيع المشي"] },
    { key: "aid", label: "استخدام أدوات مساعدة", options: ["كرسي متحرك", "عكاز", "مشاية", "لا يوجد"] },
  ],
  post_op: [
    { key: "surgeryType", label: "نوع العملية", options: ["ركبة", "ورك", "ظهر", "كتف", "أخرى"] },
    { key: "when", label: "متى تمت العملية", options: ["أقل من أسبوع", "من أسبوع إلى أقل من شهر", "من شهر إلى 3 أشهر", "أكثر من 3 أشهر"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "محدود", "لا يستطيع الحركة"] },
  ],
  speech: [
    { key: "mainIssue", label: "المشكلة الأساسية", options: ["صعوبة في الكلام", "صعوبة في البلع", "الاثنين"] },
    { key: "since", label: "متى بدأت المشكلة", options: ["أقل من شهر", "أكثر من شهر"] },
    { key: "severity", label: "شدة المشكلة", options: ["خفيفة", "متوسطة", "شديدة"] },
    { key: "impact", label: "التأثير", options: ["صعوبة في التواصل", "صعوبة في الأكل", "كلاهما"] },
  ],
  nutrition: [
    { key: "goal", label: "الهدف", options: ["زيادة وزن", "إنقاص وزن", "تنظيم غذائي"] },
    { key: "chronic", label: "هل يوجد مرض مزمن", options: ["سكري", "ضغط", "لا يوجد", "أخرى"] },
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

function buildSummary(d: BookingData): string {
  const p = d.medical.problem as ConditionId | undefined;
  const m = d.medical;
  if (!p) return "";
  if (p === "pain") {
    const clinicalType = m.duration ? `ألم ${durationMap[m.duration]}` : "ألم";
    const prior = m.priorPT === "نعم" ? "وسبق له العلاج الطبيعي لنفس المشكلة" : m.priorPT === "لا" ? "ولم يسبق له العلاج الطبيعي لهذه المشكلة" : "";
    return `يعاني المريض من ${clinicalType} في ${m.place || "—"} منذ ${m.duration || "—"}، مما يؤثر على الأنشطة اليومية (${m.impact || "—"}) ${prior}.`;
  }
  if (p === "fracture") {
    const op = m.surgery === "نعم" ? "وقد أجرى عملية جراحية" : "ولم يخضع لعملية جراحية";
    const phase = m.when ? ` (إصابة ${durationMap[m.when]})` : "";
    return `يعاني المريض من إصابة في ${m.place || "—"} منذ ${m.when || "—"}${phase}، ${op}، ومستوى الحركة الحالي: ${m.movement || "—"}.`;
  }
  if (p === "mobility") {
    const phase = m.since ? ` (حالة ${durationMap[m.since]})` : "";
    return `يعاني المريض من ${m.issueType || "—"} منذ ${m.since || "—"}${phase}، مستوى الحركة: ${m.movement || "—"}، الأدوات المساعدة: ${m.aid || "—"}.`;
  }
  if (p === "post_op") {
    const phase = m.when ? ` (مرحلة ${durationMap[m.when]})` : "";
    return `المريض في مرحلة ما بعد عملية ${m.surgeryType || "—"} التي تمت منذ ${m.when || "—"}${phase}، ومستوى الحركة: ${m.movement || "—"}.`;
  }
  if (p === "speech") {
    return `يعاني المريض من ${m.mainIssue || "—"} منذ ${m.since || "—"} بدرجة ${m.severity || "—"}، مما يسبب ${m.impact || "—"}.`;
  }
  if (p === "nutrition") {
    return `يسعى المريض إلى ${m.goal || "—"}، الأمراض المزمنة: ${m.chronic || "—"}، الالتزام الغذائي: ${m.adherence || "—"} منذ ${m.duration || "—"}.`;
  }
  return "";
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
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
            <CheckCircle2 className="h-5 w-5" />
            الملخص السريري
          </div>
          <p className="text-base leading-relaxed text-foreground">{summary}</p>
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
                update({ medical: { problem: problem! } });
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
