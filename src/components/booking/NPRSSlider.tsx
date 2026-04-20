interface Props {
  value?: string;
  onChange: (value: string) => void;
}

interface PainLevel {
  value: string; // representative NPRS score stored
  range: string;
  label: string;
  description: string;
  activeClass: string;
  idleClass: string;
  feedbackClass: string;
}

const levels: PainLevel[] = [
  {
    value: "0",
    range: "0",
    label: "لا يوجد ألم",
    description: "لا تشعر بأي ألم حالياً",
    activeClass: "bg-gradient-to-br from-slate-400 to-slate-600 text-white border-slate-600 shadow-lg",
    idleClass:
      "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
    feedbackClass:
      "border-slate-300 bg-slate-50 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-700",
  },
  {
    value: "2",
    range: "1 – 3",
    label: "ألم خفيف",
    description: "يمكنك القيام بأنشطتك اليومية بشكل طبيعي",
    activeClass: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-600 shadow-lg",
    idleClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900",
    feedbackClass:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800",
  },
  {
    value: "5",
    range: "4 – 6",
    label: "ألم متوسط",
    description: "يسبب إزعاج وقد يؤثر على بعض الأنشطة",
    activeClass: "bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-600 shadow-lg",
    idleClass:
      "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
    feedbackClass:
      "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800",
  },
  {
    value: "8",
    range: "7 – 10",
    label: "ألم شديد",
    description: "يؤثر بشكل كبير على الحركة أو النوم أو النشاط اليومي",
    activeClass: "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-700 shadow-lg",
    idleClass:
      "bg-red-50 text-red-700 border-red-200 hover:border-red-400 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900",
    feedbackClass:
      "border-red-300 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800",
  },
];

export function classifyNPRS(n: number): { label: string; description: string } {
  if (n === 0) return { label: levels[0].label, description: levels[0].description };
  if (n <= 3) return { label: levels[1].label, description: levels[1].description };
  if (n <= 6) return { label: levels[2].label, description: levels[2].description };
  return { label: levels[3].label, description: levels[3].description };
}

function levelForValue(value?: string): PainLevel | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  if (Number.isNaN(n)) return undefined;
  if (n === 0) return levels[0];
  if (n <= 3) return levels[1];
  if (n <= 6) return levels[2];
  return levels[3];
}

export function NPRSSlider({ value, onChange }: Props) {
  const selected = levelForValue(value);

  return (
    <div className="space-y-5 rounded-2xl border-2 border-border bg-card p-5 shadow-soft">
      {/* Anchor reference */}
      <div className="flex items-center justify-between gap-3 text-xs font-medium">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
          <span>لا يوجد ألم</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <span>أسوأ ألم ممكن</span>
        </div>
      </div>

      {/* Level buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {levels.map((lvl) => {
          const active = selected?.value === lvl.value;
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onChange(lvl.value)}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-4 transition-all duration-200 active:scale-95 ${
                active ? `${lvl.activeClass} scale-105 z-10` : `${lvl.idleClass} hover:scale-105`
              }`}
              aria-pressed={active}
              aria-label={lvl.label}
            >
              <span className="text-base font-extrabold">{lvl.label}</span>
              <span className={`text-xs font-semibold ${active ? "opacity-90" : "opacity-70"}`}>{lvl.range}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected && (
        <div
          key={selected.value}
          className={`animate-in fade-in zoom-in-95 rounded-2xl border-2 p-4 text-center ${selected.feedbackClass}`}
        >
          <div className="text-xl font-extrabold">{selected.label}</div>
          <div className="mt-1 text-sm font-medium opacity-90">{selected.description}</div>
        </div>
      )}
    </div>
  );
}
