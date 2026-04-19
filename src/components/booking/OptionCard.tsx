import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  compact?: boolean;
}

export function OptionCard({ selected, onClick, title, description, icon, compact }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl border-2 bg-card text-right transition-all duration-200",
        "hover:border-primary/50 hover:shadow-card active:scale-[0.98]",
        compact ? "p-4" : "p-5",
        selected
          ? "border-primary bg-gradient-to-br from-accent/40 to-card shadow-soft"
          : "border-border",
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
              selected ? "bg-gradient-brand text-white" : "bg-secondary text-primary",
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="text-base font-bold text-foreground sm:text-lg">{title}</div>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            selected ? "border-primary bg-primary text-white" : "border-border",
          )}
        >
          {selected && <Check className="h-4 w-4" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
