import { Activity, Hand, MessageCircle, Apple } from "lucide-react";
import { OptionCard } from "./OptionCard";
import type { BookingData, ServiceType } from "./types";

const services: {
  id: ServiceType;
  title: string;
  about: string;
  price: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "physio",
    title: "جلسة الفحص والعلاج الطبيعي المنزلي",
    about: "تركز على تقييم المشاكل الحركية والآلام الجسدية.",
    price: "300 - 500 ريال حسب تصنيف الاخصائي",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    id: "occupational",
    title: "جلسة الفحص والعلاج الوظيفي المنزلي",
    about: "تركز على تقييم حركة اليدين والأطراف العلوية.",
    price: "300 - 400 ريال حسب تصنيف الاخصائي",
    icon: <Hand className="h-6 w-6" />,
  },
  {
    id: "speech",
    title: "جلسة الفحص وعلاج النطق والبلع المنزلي",
    about: "تركز على تقييم وتشخيص وتحسين القدرة على الكلام والتواصل والبلع بأمان.",
    price: "300 ريال",
    icon: <MessageCircle className="h-6 w-6" />,
  },
  {
    id: "nutrition",
    title: "التغذية العلاجية",
    about: "تركز على تشخيص أولي للحالة لدعم الشفاء وتحسين صحة الجسم.",
    price: "199 ريال",
    icon: <Apple className="h-6 w-6" />,
  },
];

export function Step2Service({ data, update }: { data: BookingData; update: (d: Partial<BookingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">اختر الخدمة</h2>
        <p className="mt-1 text-muted-foreground">
          تبدأ خدماتنا بجلسة فحص وعلاج يقوم خلالها الاخصائي بزيارة المريض في منزله لإجراء تقييم شامل للحالة.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <OptionCard
            key={s.id}
            selected={data.service === s.id}
            onClick={() => update({ service: s.id })}
            title={s.title}
            description={
              <span className="block space-y-1">
                <span className="block text-muted-foreground">{s.about}</span>
                <span className="block font-semibold text-primary">{s.price}</span>
              </span>
            }
            icon={s.icon}
          />
        ))}
      </div>
    </div>
  );
}
