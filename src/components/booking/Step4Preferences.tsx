import { OptionCard } from "./OptionCard";
import { Star, Award, Crown, Sun, Moon, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { BookingData } from "./types";

export function Step4Preferences({ data, update }: { data: BookingData; update: (d: Partial<BookingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">التفضيلات</h2>
        <p className="mt-1 text-muted-foreground">اختر ما يناسبك</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">التصنيف المفضل للأخصائيـ/ة</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <OptionCard compact selected={data.preferences.expertise === "mid"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "mid" } })}
            title="متوسط الخبرة" icon={<Star className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.expertise === "high"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "high" } })}
            title="عالي الخبرة" icon={<Award className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.expertise === "expert"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "expert" } })}
            title="خبير" icon={<Crown className="h-5 w-5" />} />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">الوقت المفضل</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <OptionCard compact selected={data.preferences.time === "morning"}
            onClick={() => update({ preferences: { ...data.preferences, time: "morning" } })}
            title="صباح" icon={<Sun className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "evening"}
            onClick={() => update({ preferences: { ...data.preferences, time: "evening" } })}
            title="مساء" icon={<Moon className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "flexible"}
            onClick={() => update({ preferences: { ...data.preferences, time: "flexible" } })}
            title="مرن" icon={<Clock className="h-5 w-5" />} />
        </div>
      </div>
    </div>
  );
}
