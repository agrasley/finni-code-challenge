import dbPromise from ".";
import Patient, {
  CustomFields as PatientCustomFields,
} from "../models/Patient";
import Provider from "../models/Provider";
import CustomField from "../models/CustomField";
import { faker } from "@faker-js/faker";

function createDemoProviders() {
  return Promise.all([
    new Provider({
      id: 0,
      username: "provider1",
      firstName: "Jane",
      lastName: "Doe",
      password: "finnihealth",
    }).insert(),
    new Provider({
      id: 0,
      username: "provider2",
      firstName: "John",
      lastName: "Doe",
      password: "finnihealth",
    }).insert(),
    new Provider({
      id: 0,
      username: "provider3",
      firstName: "Jean",
      lastName: "Doe",
      password: "finnihealth",
    }).insert(),
  ]);
}

function createDemoCustomFields() {
  return Promise.all([
    new CustomField({
      id: 0,
      name: "Insurance",
      isRequired: true,
      providerId: 1,
    }).insert(),
    new CustomField({
      id: 0,
      name: "Number of Visits",
      defaultValue: "0",
      isRequired: true,
      providerId: 1,
    }).insert(),
    new CustomField({
      id: 0,
      name: "Notes",
      providerId: 1,
    }).insert(),
  ]);
}

function generateMockCustomFieldData(ids: number[]) {
  return () => {
    const maybeNotes =
      Math.random() < 0.8 ? { [ids[2]]: faker.lorem.paragraph() } : {};
    return {
      [ids[0]]: faker.company.name(),
      [ids[1]]: `${Math.round(Math.random() * 10)}`,
      ...maybeNotes,
    };
  };
}

function createDemoPatients(
  providerId: number,
  mockCustomFields?: () => PatientCustomFields,
) {
  const results = [];
  for (let i = 0; i < 100 + Math.round(Math.random() * 200); i += 1) {
    results.push(Patient.mock(providerId, mockCustomFields).insert());
  }
  return Promise.all(results);
}

dbPromise.then(async (db) => {
  await db.exec("DROP TABLE IF EXISTS provider");
  await db.exec("DROP TABLE IF EXISTS patient");
  await db.exec("DROP TABLE IF EXISTS address");
  await db.exec("DROP TABLE IF EXISTS custom_field");

  await db.exec(`CREATE TABLE IF NOT EXISTS provider (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS patient (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    status TEXT NOT NULL,
    provider INTEGER,
    custom_fields JSON NOT NULL,
    FOREIGN KEY(provider) REFERENCES provider(id)
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS address (
    addressId INTEGER PRIMARY KEY,
    line_1 TEXT NOT NULL,
    line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    patient INTEGER,
    FOREIGN KEY(patient) REFERENCES patient(id)
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS custom_field (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    is_required INTEGER NOT NULL,
    default_value TEXT,
    provider INTEGER,
    FOREIGN KEY(provider) REFERENCES provider(id)
  )`);

  await createDemoProviders();
  const fieldResults = await createDemoCustomFields();
  await createDemoPatients(
    1,
    generateMockCustomFieldData(fieldResults.map(({ lastID = 0 }) => lastID)),
  );
  await createDemoPatients(2);
});
