import { Types } from "mongoose";

export type GeolocationPoint = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

export type Address = {
  postalCode: string;
  city: string;
  geolocation: GeolocationPoint;
};

export const ALTERNANCE_TEMPO = [
  "Full-time",
  "3semaine/1semaine",
  "2semaine/2semaine",
] as const;
export type AlternanceTempo = (typeof ALTERNANCE_TEMPO)[number];

export const EXPECTED_DURATION = ["6 mois", "1 an", "2 ans"] as const;
export type ExpectedDuration = (typeof EXPECTED_DURATION)[number];

export const OFFER_STATUS = ["pending", "accepted", "rejected"] as const;
export type OfferStatus = (typeof OFFER_STATUS)[number];

export const CONTRACT_TYPE = ["CDI", "CDD", "Stage"] as const;
export type ContractType = (typeof CONTRACT_TYPE)[number];

export const EDUCATION_LEVEL = [
  "Bac",
  "Bac +1",
  "Bac +2",
  "Bac +3",
  "Bac +4",
  "Bac +5",
] as const;
export type EducationLevel = (typeof EDUCATION_LEVEL)[number];

export type Skills = {
  soft: string[];
  hard: string[];
};

export interface Offer {
  status: OfferStatus;
  companyId: Types.ObjectId;
  specialty: string;
  jobTitle: string;
  jobDescription: string;
  companyIndustry: string;
  contractType: ContractType;
  educationLevel: EducationLevel;
  alternanceTempo: AlternanceTempo;
  address: Address;
  skills: Skills;
  expectedDuration: ExpectedDuration;
}
