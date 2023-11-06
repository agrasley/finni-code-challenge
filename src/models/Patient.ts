export type Status = "Inquiry" | "Onboarding" | "Active" | "Churned";

export class Address {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;

  constructor({
    id,
    line1,
    line2,
    city,
    state,
    zip,
  }: {
    id: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  }) {
    this.id = id;
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.zip = zip;
  }
}

export type CustomFields = Record<number, string>;

export default class Patient {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: Status;
  providerId: number;
  addresses: Address[];
  customFields: CustomFields;

  constructor({
    id,
    firstName,
    middleName,
    lastName,
    dob,
    status,
    providerId,
    addresses,
    customFields = {},
  }: {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    status: Status;
    providerId: number;
    addresses: Address[];
    customFields?: CustomFields;
  }) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dob = dob;
    this.status = status;
    this.providerId = providerId;
    this.addresses = addresses;
    this.customFields = customFields;
  }
}
