import dbPromise from ".";
import Patient from "../models/Patient";
import Provider from "../models/Provider";

function createDemoProviders() {
  return Promise.all([
    new Provider({
      id: 0,
      username: "provider1",
      firstName: "Jane",
      lastName: "Doe",
      password: "1234",
    }).insert(),
    new Provider({
      id: 0,
      username: "provider2",
      firstName: "John",
      lastName: "Doe",
      password: "1234",
    }).insert(),
    new Provider({
      id: 0,
      username: "provider3",
      firstName: "Jean",
      lastName: "Doe",
      password: "1234",
    }).insert(),
  ]);
}

function createDemoPatients(providerId: number) {
  const results = [];
  for (let i = 0; i < 100 + Math.round(Math.random() * 200); i += 1) {
    results.push(Patient.mock(providerId).insert());
  }
  return Promise.all(results);
}

dbPromise.then(async (db) => {
  await db.exec("DROP TABLE IF EXISTS provider");
  await db.exec("DROP TABLE IF EXISTS patient");
  await db.exec("DROP TABLE IF EXISTS address");

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
    FOREIGN KEY(provider) REFERENCES provider(id)
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS address (
    id INTEGER PRIMARY KEY,
    line_1 TEXT NOT NULL,
    line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    patient INTEGER,
    FOREIGN KEY(patient) REFERENCES patient(id)
  )`);

  await createDemoProviders();
  await createDemoPatients(1);
  await createDemoPatients(2);
});
