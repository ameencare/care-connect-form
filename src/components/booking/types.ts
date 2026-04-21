export type BookingFor = "self" | "companion" | null;
export type ServiceType = "physio" | "occupational" | "speech" | "nutrition" | null;
export type ProblemType = "pain" | "fracture" | "weakness" | "speech" | "nutrition" | null;

export interface BookingData {
  bookingFor: BookingFor;
  patient: {
    fullName: string;
    age: string;
    nationalId: string;
    phone: string;
  };
  companion: {
    name: string;
    phone: string;
  };
  service: ServiceType;
  medical: Record<string, string>;
  medicalNote?: string;
  attachmentName?: string;
  preferences: {
    gender: "male" | "female" | "any" | null;
    time: "morning" | "noon" | "afternoon" | "evening" | "flexible" | null;
    expertise: "junior" | "senior" | "expert" | null;
  };
}

export const initialData: BookingData = {
  bookingFor: null,
  patient: { fullName: "", age: "", nationalId: "", phone: "" },
  companion: { name: "", phone: "" },
  service: null,
  medical: {},
  preferences: { gender: null, time: null, expertise: null },
};
