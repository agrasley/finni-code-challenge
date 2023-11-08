export type Status = "Inquiry" | "Onboarding" | "Active" | "Churned";

export type Address = {
  id: number;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
};

export type CustomFields = Record<number, string>;

type Patient = {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: Status;
  providerId: number;
  addresses: Address[];
  customFields: CustomFields;
};

export default Patient;
