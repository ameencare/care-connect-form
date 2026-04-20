import { Slider } from "@/components/ui/slider";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function classifyNPRS(n: number): { label: string; description: string } {
  if (n === 0) return { label: "لا يوجد ألم", description: "لا يوجد ألم" };
  if (n <= 3)
    return {
      label: "ألم خفيف",
      description: "ألم خفيف — يمكنك القيام بأنشطتك اليومية بشكل طبيعي",
    };
  if (n <= 6)
    return {
      label: "ألم متوسط",
      description: "ألم متوسط — يسبب إزعاج وقد يؤثر على بعض الأنشطة",
    };
  return {
    label: "ألم شديد",
    description: "ألم شديد — يؤثر بشكل كبير على الحركة أو النوم أو النشاط اليومي",
  };
}

export function NPRSSlider({ value, onChange }: Props) {
  const hasValue = value !== undefined && value !== "";
  const numeric = hasValue ? Number(value) : 0;
  const { label, description } = classifyNPRS(numeric);

  const colorClass =
    numeric === 0
      ? "from-emerald-500 to-emerald-600"
      : numeric <= 3
        ? "from-emerald-500 to-lime-500"
        : numeric <= 6
          ? "from-amber-500 to-orange-500"
          : "from-orange-600 to-red-600";

  return (
    <div className="space-y-5 rounded-2xl border-2 border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col items-center gap-2">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-4xl font-extrabold text-white shadow-soft transition-all`}
        >
          {hasValue ? numeric : "—"}
        </div>
        <div className="text-sm font-semibold text-muted-foreground">
          {hasValue ? `${numeric} / 10 — ${label}` : "اسحب لتحديد شدة الألم"}
        </div>
      </div>

      <div className="px-2">
        <Slider
          value={[numeric]}
          min={0}
          max={10}
          step={1}
          onValueChange={(v) => onChange(String(v[0]))}
          dir="ltr"
        />
        <div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className={numeric === i && hasValue ? "text-primary font-bold" : ""}>
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 text-xs">
        <div className="flex-1 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-400">
          <div className="font-bold">0</div>
          <div>لا يوجد ألم</div>
        </div>
        <div className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-right text-red-700 dark:text-red-400">
          <div className="font-bold">10</div>
          <div>أسوأ ألم ممكن تتخيله</div>
        </div>
      </div>

      {hasValue && (
        <div
          className={`animate-in fade-in rounded-xl border-2 p-3 text-sm font-medium ${
            numeric === 0
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              : numeric <= 3
                ? "border-lime-500/30 bg-lime-500/5 text-lime-700 dark:text-lime-400"
                : numeric <= 6
                  ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                  : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400"
          }`}
        >
          {description}
        </div>
      )}
    </div>
  );
}
