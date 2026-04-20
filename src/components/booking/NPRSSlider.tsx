interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function classifyNPRS(n: number): { label: string; description: string } {
  if (n === 0) return { label: "لا يوجد ألم", description: "لا تشعر بأي ألم حالياً" };
  if (n <= 3)
    return {
      label: "ألم خفيف",
      description: "يمكنك القيام بأنشطتك اليومية بشكل طبيعي",
    };
  if (n <= 6)
    return {
      label: "ألم متوسط",
      description: "يسبب إزعاج وقد يؤثر على بعض الأنشطة",
    };
  return {
    label: "ألم شديد",
    description: "يؤثر بشكل كبير على الحركة أو النوم أو النشاط اليومي",
  };
}

function colorsFor(n: number, active: boolean) {
  if (n === 0)
    return active
      ? "bg-gradient-to-br from-slate-400 to-slate-600 text-white border-slate-600 shadow-lg"
      : "bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700";
  if (n <= 3)
    return active
      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-600 shadow-lg"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900";
  if (n <= 6)
    return active
      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-600 shadow-lg"
      : "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900";
  return active
    ? "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-700 shadow-lg"
    : "bg-red-50 text-red-700 border-red-200 hover:border-red-400 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900";
}

function feedbackColors(n: number) {
  if (n === 0) return "border-slate-300 bg-slate-50 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-700";
  if (n <= 3) return "border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800";
  if (n <= 6) return "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800";
  return "border-red-300 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800";
}

export function NPRSSlider({ value, onChange }: Props) {
  const hasValue = value !== undefined && value !== "";
  const numeric = hasValue ? Number(value) : -1;
  const info = hasValue ? classifyNPRS(numeric) : null;

  return (
    <div className="space-y-5 rounded-2xl border-2 border-border bg-card p-5 shadow-soft">
      {/* Anchor reference */}
      <div className="flex items-center justify-between gap-3 text-xs font-medium">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
          <span className="font-bold">0</span>
          <span>= لا يوجد ألم</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <span className="font-bold">10</span>
          <span>= أسوأ ألم ممكن تتخيله</span>
        </div>
      </div>

      {/* Number buttons */}
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-11" dir="ltr">
        {Array.from({ length: 11 }, (_, i) => {
          const active = numeric === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i))}
              className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-2xl font-extrabold transition-all duration-200 active:scale-95 ${colorsFor(
                i,
                active,
              )} ${active ? "scale-110 z-10" : "hover:scale-105"}`}
              aria-pressed={active}
              aria-label={`شدة الألم ${i}`}
            >
              {i}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {info && (
        <div
          key={numeric}
          className={`animate-in fade-in zoom-in-95 rounded-2xl border-2 p-4 text-center ${feedbackColors(numeric)}`}
        >
          <div className="text-2xl font-extrabold">
            {numeric} / 10 — {info.label}
          </div>
          <div className="mt-1 text-sm font-medium opacity-90">{info.description}</div>
        </div>
      )}
    </div>
  );
}
