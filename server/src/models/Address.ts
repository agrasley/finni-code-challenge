import dbPromise from "../db";
import { faker } from "@faker-js/faker";

export default class Address {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  patientId?: number;

  constructor({
    id,
    line1,
    line2,
    city,
    state,
    zip,
    patientId,
  }: {
    id: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    patientId?: number;
  }) {
    this.id = id;
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.patientId = patientId;
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

  static async getById(id: number) {
    const db = await dbPromise;
    const row = await db.get("SELECT * FROM address WHERE address_id = ?", id);
    return new Address({
      id: row.address_id,
      line1: row.line1,
      line2: row.line2,
      city: row.city,
      state: row.state,
      zip: row.zip,
      patientId: row.patient,
    });
  }

  async insert() {
    const db = await dbPromise;
    return db.run(
      "INSERT INTO address (line_1, line_2, city, state, zip, patient) VALUES (?, ?, ?, ?, ?, ?)",
      [this.line1, this.line2, this.city, this.state, this.zip, this.patientId],
    );
  }

  async update() {
    const db = await dbPromise;
    return db.run(
      "UPDATE address SET line_1 = ?, line_2 = ?, city = ?, state = ?, zip = ? WHERE address_id = ?",
      [this.line1, this.line2, this.city, this.state, this.zip, this.id],
    );
  }

  async delete() {
    const db = await dbPromise;
    return db.run("DELETE FROM address WHERE address_id = ?", this.id);
  }
}
