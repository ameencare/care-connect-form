import { useMemo, useState } from "react";
import { OptionCard } from "./OptionCard";
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
} from "lucide-react";
import type { BookingData, ServiceType } from "./types";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
}

type ConditionId = "pain" | "fracture" | "mobility" | "speech" | "nutrition";

const allConditions: { id: ConditionId; title: string; icon: React.ReactNode }[] = [
  { id: "pain", title: "ألم", icon: <AlertCircle className="h-6 w-6" /> },
  { id: "fracture", title: "كسر / إصابة", icon: <Bone className="h-6 w-6" /> },
  { id: "mobility", title: "ضعف حركي / تأهيل", icon: <Activity className="h-6 w-6" /> },
  { id: "speech", title: "مشكلة في النطق أو البلع", icon: <MessageCircle className="h-6 w-6" /> },
  { id: "nutrition", title: "مشكلة غذائية", icon: <Apple className="h-6 w-6" /> },
];

const serviceToConditions: Record<NonNullable<ServiceType>, ConditionId[]> = {
  physio: ["pain", "fracture", "mobility"],
  occupational: ["pain", "fracture", "mobility"],
  speech: ["speech"],
  nutrition: ["nutrition"],
};

const flow: Record<ConditionId, { key: string; label: string; options: string[] }[]> = {
  pain: [
    { key: "painType", label: "نوع الألم", options: ["حاد", "نابض", "حارق", "شد عضلي", "تنميل"] },
    { key: "place", label: "مكان الألم", options: ["الظهر", "الركبة", "الرقبة", "الكتف", "أخرى"] },
    { key: "duration", label: "مدة الألم", options: ["أقل من أسبوع", "من أسبوع إلى شهر", "أكثر من شهر"] },
    { key: "severity", label: "شدة الألم", options: ["خفيف", "متوسط", "شديد"] },
    { key: "impact", label: "التأثير على النشاط", options: ["لا يؤثر", "يؤثر بشكل بسيط", "يؤثر بشكل كبير"] },
  ],
  fracture: [
    { key: "place", label: "مكان الإصابة", options: ["يد", "رجل", "ظهر", "أخرى"] },
    { key: "when", label: "متى حدثت الإصابة", options: ["أقل من أسبوع", "من أسبوع إلى شهر", "أكثر من شهر"] },
    { key: "surgery", label: "هل تم إجراء عملية", options: ["نعم", "لا"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "محدود", "لا يستطيع الحركة"] },
  ],
  mobility: [
    { key: "mainIssue", label: "المشكلة الرئيسية", options: ["صعوبة في المشي", "ضعف عضلي", "بعد عملية", "بعد جلطة"] },
    { key: "since", label: "مدة الحالة", options: ["أقل من شهر", "أكثر من شهر"] },
    { key: "movement", label: "مستوى الحركة", options: ["طبيعي", "بمساعدة", "لا يستطيع المشي"] },
    { key: "aid", label: "استخدام أدوات مساعدة", options: ["كرسي متحرك", "عكاز", "لا يوجد"] },
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

function buildSummary(d: BookingData): string {
  const p = d.medical.problem as ConditionId | undefined;
  const m = d.medical;
  if (!p) return "";
  if (p === "pain") {
    return `يعاني المريض من ألم ${m.painType || ""} في ${m.place || "—"} منذ ${m.duration || "—"} بدرجة ${m.severity || "—"}، والتأثير على النشاط: ${m.impact || "—"}.`;
  }
  if (p === "fracture") {
    const op = m.surgery === "نعم" ? "وقد أجرى عملية جراحية" : "ولم يخضع لعملية جراحية";
    return `يعاني المريض من إصابة في ${m.place || "—"} منذ ${m.when || "—"}، ${op}، ومستوى الحركة: ${m.movement || "—"}.`;
  }
  if (p === "mobility") {
    return `يعاني المريض من ${m.mainIssue || "—"} منذ ${m.since || "—"}، مستوى الحركة: ${m.movement || "—"}، الأدوات المساعدة: ${m.aid || "—"}.`;
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
  const allAnswered = questions.length > 0 && questions.every((q) => data.medical[q.key]);
  const summary = useMemo(() => buildSummary(data), [data]);
  const [fileName, setFileName] = useState<string | undefined>(data.attachmentName);

  const setAnswer = (key: string, value: string) => {
    update({ medical: { ...data.medical, [key]: value } });
    setConfirmed(false);
  };

  // Auto-select the only condition if there's just one
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
        <p className="mt-1 text-muted-foreground">ما نوع المشكلة الصحية؟</p>
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

      {questions.map((q) => (
        <div key={q.key} className="animate-in fade-in slide-in-from-bottom-2 space-y-3">
          <Label className="text-base font-semibold">{q.label}</Label>
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
        </div>
      ))}

      {problem === "fracture" && (
        <div className="animate-in fade-in space-y-2">
          <Label className="text-sm font-semibold">إرفاق تقرير طبي (اختياري)</Label>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-4 transition hover:border-primary/50">
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
            ملخص الحالة
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
