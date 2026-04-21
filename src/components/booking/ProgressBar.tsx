import { cn } from "@/lib/utils";

const labels = ["البيانات الشخصية", "الخدمة المطلوبة", "الحالة الصحية", "التفضيلات وتأكيد الحجز"];

export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-gradient-brand px-3 py-1 text-xs font-bold text-white sm:text-sm">
          الخطوة {step} من {total}
        </span>
        <span className="text-base font-bold text-foreground sm:text-lg">{labels[step - 1]}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between gap-2">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-9 sm:w-9",
                i + 1 < step && "bg-gradient-brand text-white",
                i + 1 === step && "bg-gradient-brand text-white ring-4 ring-primary/20",
                i + 1 > step && "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold leading-tight sm:text-xs",
                i + 1 === step ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
