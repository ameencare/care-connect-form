import { User, Users } from "lucide-react";
import { OptionCard } from "./OptionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BookingData } from "./types";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
}

export function Step1Owner({ data, update }: Props) {
  const isSelf = data.bookingFor === "self";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">البيانات الشخصية</h2>
        <p className="mt-1 text-muted-foreground">الحجز لمن؟</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard
          selected={data.bookingFor === "self"}
          onClick={() => update({ bookingFor: "self" })}
          title="لنفسي"
          icon={<User className="h-6 w-6" />}
        />
        <OptionCard
          selected={data.bookingFor === "companion"}
          onClick={() => update({ bookingFor: "companion" })}
          title="لشخص آخر"
          icon={<Users className="h-6 w-6" />}
        />
      </div>

      {data.bookingFor && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-lg font-bold text-foreground">
            {isSelf ? "بياناتك" : "بيانات المريض"}
          </h3>

          <Field
            label={isSelf ? "الاسم الكامل" : "اسم المريض"}
            value={data.patient.fullName}
            onChange={(v) => update({ patient: { ...data.patient, fullName: v } })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label={isSelf ? "العمر" : "عمر المريض"}
              type="number"
              value={data.patient.age}
              onChange={(v) => update({ patient: { ...data.patient, age: v } })}
            />
            <Field
              label="رقم الهوية"
              value={data.patient.nationalId}
              onChange={(v) => update({ patient: { ...data.patient, nationalId: v } })}
            />
          </div>

          {isSelf && (
            <Field
              label="رقم الجوال"
              type="tel"
              value={data.patient.phone}
              onChange={(v) => update({ patient: { ...data.patient, phone: v } })}
            />
          )}

          {data.bookingFor === "companion" && (
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-lg font-bold text-foreground">مرافق المريض</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="اسم المرافق"
                  value={data.companion.name}
                  onChange={(v) => update({ companion: { ...data.companion, name: v } })}
                />
                <Field
                  label="رقم جوال المرافق"
                  type="tel"
                  value={data.companion.phone}
                  onChange={(v) => update({ companion: { ...data.companion, phone: v } })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl text-base"
        dir="rtl"
      />
    </div>
  );
}
