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

export default class Patient {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  status: Status;
  providerId: number;
  addresses: Address[];

  constructor({
    id,
    firstName,
    middleName,
    lastName,
    dob,
    status,
    providerId,
    addresses,
  }: {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: Date;
    status: Status;
    providerId: number;
    addresses: Address[];
  }) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dob = dob;
    this.status = status;
    this.providerId = providerId;
    this.addresses = addresses;
  }

  static mock(providerId = 0): Patient {
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
      dob: faker.date.birthdate({
        min: 2,
        max: 18,
      }),
      status: faker.helpers.arrayElement([
        "Inquiry",
        "Onboarding",
        "Active",
        "Churned",
      ]),
      providerId,
      addresses,
    });
  }

  async insert() {
    const db = await dbPromise;
    const result = await db.run(
      "INSERT INTO patient (first_name, middle_name, last_name, dob, status, provider) VALUES (?, ?, ?, ?, ?, ?)",
      [
        this.firstName,
        this.middleName,
        this.lastName,
        this.dob.toLocaleDateString("en-US"),
        this.status,
        this.providerId,
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
