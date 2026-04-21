import type { BookingData } from "./types";

export type ExpertiseLevel = "junior" | "senior" | "expert";

export interface Recommendation {
  level: ExpertiseLevel;
  title: string;
  reason: string;
}

export const expertiseTitle: Record<ExpertiseLevel, string> = {
  junior: "أخصائي متوسط الخبرة (Junior)",
  senior: "أخصائي عالي الخبرة (Senior)",
  expert: "أخصائي خبير (Expert)",
};

const durationMap: Record<string, string> = {
  "أقل من أسبوع": "حاد",
  "من أسبوع إلى أقل من شهر": "حاد",
  "من شهر إلى 3 أشهر": "شبه حاد",
  "أكثر من 3 أشهر": "مزمن",
};

export function recommendExpertise(d: BookingData): Recommendation | null {
  const p = d.medical.problem;
  if (!p) return null;
  const m = d.medical;
  const reasons: string[] = [];
  let score = 0;

  const durationKey = m.duration || m.when || m.since;
  if (durationKey) {
    const phase = durationMap[durationKey];
    if (phase === "مزمن") {
      score += 2;
      reasons.push("الحالة مزمنة");
    } else if (phase === "شبه حاد") {
      score += 1;
      reasons.push("الحالة شبه حادة");
    }
  }

  if (m.movement === "لا يستطيع الحركة" || m.movement === "لا يستطيع المشي") {
    score += 2;
    reasons.push("ضعف شديد في الحركة");
  } else if (m.movement === "محدود" || m.movement === "بمساعدة") {
    score += 1;
    reasons.push("حركة محدودة");
  }

  if (m.severity === "شديدة") {
    score += 2;
    reasons.push("شدة عالية");
  } else if (m.severity === "متوسطة") {
    score += 1;
    reasons.push("شدة متوسطة");
  }

  if (p === "post_op" || m.surgery === "نعم") {
    score += 2;
    reasons.push("حالة ما بعد عملية جراحية");
  }

  if (m.priorPT === "نعم") {
    score += 1;
    reasons.push("سبق علاج طبيعي لنفس المشكلة");
  }

  if (m.aid && m.aid !== "لا يوجد") {
    score += 1;
    reasons.push("يستخدم أداة مساعدة");
  }

  if (m.chronic && m.chronic !== "لا يوجد") {
    score += 1;
    reasons.push(`وجود مرض مزمن (${m.chronic})`);
  }

  let level: ExpertiseLevel = "junior";
  if (score >= 4) level = "expert";
  else if (score >= 2) level = "senior";

  const reason = reasons.length ? reasons.join("، ") : "حالة عامة تحتاج دعماً أولياً";

  return { level, title: expertiseTitle[level], reason };
}
