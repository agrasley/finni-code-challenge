import dbPromise from "../db";
import { faker } from "@faker-js/faker";

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

  static mock(): Address {
    return new Address({
      id: 0,
      line1: faker.location.streetAddress(),
      line2:
        Math.random() > 0.8 ? faker.location.secondaryAddress() : undefined,
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    });
  }
}

export type CustomFields = Record<number, string | number>;

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

  static async getByProvider(providerId: number) {
    const db = await dbPromise;
    const patients: Record<number, Patient> = {};
    const rows = await db.all(
      "SELECT * FROM patient LEFT JOIN address ON patient.id = address.patient WHERE provider = ?",
      providerId,
    );
    rows.forEach((row) => {
      if (patients[row.id]) {
        patients[row.id].addresses.push(
          new Address({
            id: row.addressId,
            line1: row.line_1,
            line2: row.line_2,
            city: row.city,
            state: row.state,
            zip: row.zip,
          }),
        );
      } else {
        patients[row.id] = new Patient({
          id: row.id,
          firstName: row.first_name,
          middleName: row.middle_name,
          lastName: row.last_name,
          dob: row.dob,
          status: row.status,
          providerId: row.provider,
          addresses: [
            new Address({
              id: row.addressId,
              line1: row.line_1,
              line2: row.line_2,
              city: row.city,
              state: row.state,
              zip: row.zip,
            }),
          ],
          customFields: JSON.parse(row.custom_fields),
        });
      }
    });
    return Object.values(patients);
  }

  static mock(
    providerId: number,
    mockCustomFields?: () => CustomFields,
  ): Patient {
    const addresses = [Address.mock()];
    const randomAddress = Math.random();
    if (randomAddress > 0.8) {
      addresses.push(Address.mock());
      if (randomAddress > 0.95) {
        addresses.push(Address.mock());
      }
    }
    return new Patient({
      id: 0,
      firstName: faker.person.firstName(),
      middleName: Math.random() < 0.8 ? faker.person.middleName() : undefined,
      lastName: faker.person.lastName(),
      dob: faker.date
        .birthdate({
          min: 2,
          max: 18,
          mode: "age",
        })
        .toLocaleDateString("en-US"),
      status: faker.helpers.arrayElement([
        "Inquiry",
        "Onboarding",
        "Active",
        "Churned",
      ]),
      providerId,
      addresses,
      customFields: mockCustomFields?.(),
    });
  }

  async update() {
    const db = await dbPromise;
    await db.run(
      "UPDATE patient SET first_name = ?, middle_name = ?, last_name = ?, dob = ?, status = ?, custom_fields = json(?) WHERE id = ?",
      [
        this.firstName,
        this.middleName,
        this.lastName,
        this.dob,
        this.status,
        JSON.stringify(this.customFields),
        this.id,
      ],
    );
  }

  async insert() {
    const db = await dbPromise;
    const result = await db.run(
      "INSERT INTO patient (first_name, middle_name, last_name, dob, status, provider, custom_fields) VALUES (?, ?, ?, ?, ?, ?, json(?))",
      [
        this.firstName,
        this.middleName,
        this.lastName,
        this.dob,
        this.status,
        this.providerId,
        JSON.stringify(this.customFields),
      ],
    );
    await Promise.all(
      this.addresses.map((address) =>
        db.run(
          "INSERT INTO address (line_1, line_2, city, state, zip, patient) VALUES (?, ?, ?, ?, ?, ?)",
          [
            address.line1,
            address.line2,
            address.city,
            address.state,
            address.zip,
            result.lastID,
          ],
        ),
      ),
    );
    return result;
  }
}
