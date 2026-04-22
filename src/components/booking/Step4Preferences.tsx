import { OptionCard } from "./OptionCard";
import { Sun, Sunset, Moon, CloudSun, Clock, GraduationCap, Award, Star, Sparkles } from "lucide-react";
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

      {recommendation && (
        <div className="rounded-3xl border-2 border-primary bg-gradient-to-br from-accent/50 to-card p-6 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-base font-bold text-primary">
            <Sparkles className="h-6 w-6" />
            مستوى الخبرة المقترح لحالتك
          </div>
          <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
            {recommendation.title}
          </div>
          <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            بناءً على: {recommendation.reason}.
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            يمكنك اختيار مستوى مختلف من القائمة أدناه إذا رغبت بذلك.
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-base font-semibold">مستوى خبرة الاخصائي</Label>

        <div className="grid gap-3">
          <OptionCard
            selected={data.preferences.expertise === "junior"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "junior" } })}
            title="اخصائي متوسط الخبرة"
            description="خبرة من 1 إلى 3 سنوات، مناسب للحالات العامة التي تحتاج دعماً أولياً."
            icon={<GraduationCap className="h-5 w-5" />}
          />
          <OptionCard
            selected={data.preferences.expertise === "senior"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "senior" } })}
            title="اخصائي عالي الخبرة"
            description="خبرة من 4 إلى 9 سنوات، مناسب للحالات المتقدمة التي تتطلب خبرة أعمق."
            icon={<Award className="h-5 w-5" />}
          />
          <OptionCard
            selected={data.preferences.expertise === "expert"}
            onClick={() => update({ preferences: { ...data.preferences, expertise: "expert" } })}
            title="اخصائي خبير"
            description="خبرة فوق 10 سنوات، الخيار الأنسب للحالات المعقدة."
            icon={<Star className="h-5 w-5" />}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">الوقت المفضل</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionCard compact selected={data.preferences.time === "morning"}
            onClick={() => update({ preferences: { ...data.preferences, time: "morning" } })}
            title="الصباح" description="من 8:00 ص إلى 12 م" icon={<Sun className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "noon"}
            onClick={() => update({ preferences: { ...data.preferences, time: "noon" } })}
            title="الظهر" description="من 12:00 م إلى 3:00 م" icon={<CloudSun className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "afternoon"}
            onClick={() => update({ preferences: { ...data.preferences, time: "afternoon" } })}
            title="العصر" description="من 3:00 م إلى 6:00 م" icon={<Sunset className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "evening"}
            onClick={() => update({ preferences: { ...data.preferences, time: "evening" } })}
            title="المساء" description="من 6:00 م إلى 10:00 م" icon={<Moon className="h-5 w-5" />} />
          <OptionCard compact selected={data.preferences.time === "flexible"}
            onClick={() => update({ preferences: { ...data.preferences, time: "flexible" } })}
            title="مرن" description="أي وقت مناسب" icon={<Clock className="h-5 w-5" />} />
        </div>
      </div>
    </div>
  );
}
