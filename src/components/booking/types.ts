export type BookingFor = "self" | "companion" | null;
export type ServiceType = "physio" | "occupational" | "speech" | "nutrition" | null;
export type ProblemType = "pain" | "fracture" | "weakness" | "speech" | "nutrition" | null;

export interface BookingData {
  bookingFor: BookingFor;
  patient: {
    fullName: string;
    age: string;
    nationalId: string;
  };
  companion: {
    name: string;
    phone: string;
  };
  service: ServiceType;
  medical: Record<string, string>;
  attachmentName?: string;
  preferences: {
    expertise: "mid" | "high" | "expert" | null;
    time: "morning" | "evening" | "flexible" | null;
  };
}

export const initialData: BookingData = {
  bookingFor: null,
  patient: { fullName: "", age: "", nationalId: "" },
  companion: { name: "", phone: "" },
  service: null,
  medical: {},
  preferences: { expertise: null, time: null },
};
