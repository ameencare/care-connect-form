import { OptionCard } from "./OptionCard";
import { Sun, Moon, Clock, GraduationCap, Award, Star, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { BookingData } from "./types";
import { recommendExpertise } from "./recommendExpertise";

export function Step4Preferences({ data, update }: { data: BookingData; update: (d: Partial<BookingData>) => void }) {
  const recommendation = recommendExpertise(data);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">التفضيلات وتأكيد الحجز</h2>
        <p className="mt-1 text-muted-foreground">اختر ما يناسبك</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">مستوى خبرة الأخصائي</Label>

        {recommendation && (
          <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
              <Sparkles className="h-4 w-4" />
              التلميح: مستوى الخبرة المقترح لحالتك
            </div>
            <div className="text-base font-bold text-foreground">{recommendation.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              بناءً على: {recommendation.reason}.
            </div>
          </div>
        )}

        <div className="grid gap-3">
          <OptionCard
            selected={data.preferences.expertise === "junior"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "junior" } })}
            title={`أخصائي متوسط الخبرة (Junior)${recommendation?.level === "junior" ? " — مقترح" : ""}`}
            description="خبرة من 1 إلى 3 سنوات، مناسب للحالات العامة التي تحتاج دعماً أولياً. تكلفة الجلسة: 250 - 300 ريال."
            icon={<GraduationCap className="h-5 w-5" />}
          />
          <OptionCard
            selected={data.preferences.expertise === "senior"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "senior" } })}
            title={`أخصائي عالي الخبرة (Senior)${recommendation?.level === "senior" ? " — مقترح" : ""}`}
            description="خبرة من 4 إلى 9 سنوات، مناسب للحالات المتقدمة التي تتطلب خبرة أعمق. تكلفة الجلسة: 300 - 400 ريال."
            icon={<Award className="h-5 w-5" />}
          />
          <OptionCard
            selected={data.preferences.expertise === "expert"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "expert" } })}
            title={`أخصائي خبير (Expert)${recommendation?.level === "expert" ? " — مقترح" : ""}`}
            description="خبرة فوق 10 سنوات، الخيار الأنسب للحالات المعقدة. تكلفة الجلسة: 400 - 500 ريال."
            icon={<Star className="h-5 w-5" />}
          />
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
