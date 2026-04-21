import { createFileRoute } from "@tanstack/react-router";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const Route = createFileRoute("/")({
  component: BookingWizard,
  head: () => ({
    meta: [
      { title: "رعاية أمين — احجز خدمتك الصحية المنزلية" },
      { name: "description", content: "احجز خدمات الرعاية الصحية المنزلية مع رعاية أمين: علاج طبيعي، علاج وظيفي، نطق وبلع، والتغذية العلاجية." },
    ],
  }),
});
