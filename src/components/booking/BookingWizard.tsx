import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { Step1Owner } from "./Step1Owner";
import { Step2Service } from "./Step2Service";
import { Step3Medical } from "./Step3Medical";
import { Step4Preferences } from "./Step4Preferences";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { initialData, type BookingData } from "./types";
import logo from "@/assets/ameen-logo.png";

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialData);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch: Partial<BookingData>) => setData((d) => ({ ...d, ...patch }));

  const canNext = (() => {
    if (step === 1) {
      if (!data.bookingFor) return false;
      if (!data.patient.fullName || !data.patient.age || !data.patient.nationalId) return false;
      if (data.bookingFor === "self" && !data.patient.phone) return false;
      if (data.bookingFor === "companion" && (!data.companion.name || !data.companion.phone)) return false;
      return true;
    }
    if (step === 2) return !!data.service;
    if (step === 3) return confirmed;
    if (step === 4) return !!data.preferences.gender && !!data.preferences.time;
    return false;
  })();

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-white shadow-soft">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">تم استلام طلبك بنجاح</h2>
        <p className="mt-2 text-muted-foreground">سيتواصل معك فريق رعاية أمين قريباً.</p>
        <pre dir="ltr" className="mt-6 max-h-72 overflow-auto rounded-2xl bg-secondary p-4 text-left text-xs">
{JSON.stringify(data, null, 2)}
        </pre>
        <Button className="mt-6 bg-gradient-brand text-white" onClick={() => { setData(initialData); setStep(1); setDone(false); setConfirmed(false); }}>
          حجز جديد
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-col items-center gap-3 text-center">
        <img src={logo} alt="رعاية أمين" className="h-20 w-auto sm:h-24" />
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">رعاية أمين</h1>
          <p className="text-sm text-muted-foreground">احجز خدمتك الصحية المنزلية بسهولة</p>
        </div>
      </header>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
        <ProgressBar step={step} total={4} />

        <div className="mt-7">
          {step === 1 && <Step1Owner data={data} update={update} />}
          {step === 2 && <Step2Service data={data} update={update} />}
          {step === 3 && <Step3Medical data={data} update={update} confirmed={confirmed} setConfirmed={setConfirmed} />}
          {step === 4 && <Step4Preferences data={data} update={update} />}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="h-12 rounded-xl px-5 text-base"
          >
            <ChevronRight className="ml-1 h-5 w-5" />
            السابق
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="h-12 flex-1 rounded-xl bg-gradient-brand px-5 text-base font-bold text-white shadow-soft hover:opacity-90 sm:flex-none sm:px-8"
            >
              التالي
              <ChevronLeft className="mr-1 h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setDone(true)}
              disabled={!canNext}
              className="h-12 flex-1 rounded-xl bg-gradient-brand px-5 text-base font-bold text-white shadow-soft hover:opacity-90 sm:flex-none sm:px-8"
            >
              تأكيد الحجز
              <CheckCircle2 className="mr-1 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        © رعاية أمين — خدمات الرعاية الصحية المنزلية
      </p>
    </div>
  );
}
