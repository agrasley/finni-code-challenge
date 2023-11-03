import { Database } from "sqlite3";
import { open, Database as DB } from "sqlite";
import path from "path";
import { unlink, existsSync } from "fs";
import Provider from "../models/Provider";

const p = path.join(__dirname, "../../db/database.db");
if (existsSync(p)) {
  unlink(p, (err) => {
    if (err) throw err;
  });
}

function createDemoProviders() {
  return Promise.all([
    new Provider({
      id: 0,
      username: "provider1",
      firstName: "Jane",
      lastName: "Doe",
      password: "1234",
    }).insertProvider(),
    new Provider({
      id: 0,
      username: "provider2",
      firstName: "John",
      lastName: "Doe",
      password: "1234",
    }).insertProvider(),
    new Provider({
      id: 0,
      username: "provider3",
      firstName: "Jean",
      lastName: "Doe",
      password: "1234",
    }).insertProvider(),
  ]);
}

open({
  filename: p,
  driver: Database,
}).then(async (db) => {
  await db.exec(`CREATE TABLE provider (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
  )`);
  await db.exec(`CREATE TABLE patient (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    status TEXT NOT NULL,
    provider INTEGER,
    FOREIGN KEY(provider) REFERENCES provider(id)
  )`);
  await db.exec(`CREATE TABLE address (
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
});
