import { cn } from "@/lib/utils";

const labels = ["البيانات الشخصية", "الخدمة المطلوبة", "الحالة الصحية", "التفضيلات وتأكيد الحجز"];

export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-primary">
          الخطوة {step} من {total}
        </span>
        <span className="text-muted-foreground">{labels[step - 1]}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-8 sm:w-8",
                i + 1 < step && "bg-gradient-brand text-white",
                i + 1 === step && "bg-gradient-brand text-white ring-4 ring-primary/20",
                i + 1 > step && "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
