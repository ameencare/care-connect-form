import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < step;
          const isCurrent = stepNum === step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-10 sm:w-10",
                  isCompleted && "bg-primary text-white shadow-soft",
                  isCurrent && "scale-110 bg-gradient-brand text-white shadow-soft ring-4 ring-primary/25",
                  !isCompleted && !isCurrent && "bg-secondary text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" strokeWidth={3} /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold leading-tight transition-colors sm:text-xs",
                  isCurrent && "text-primary",
                  isCompleted && "text-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
