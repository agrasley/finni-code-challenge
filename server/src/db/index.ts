import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const p = path.join(__dirname, "../../db/database.db");

export default open({
  filename: p,
  driver: sqlite3.cached.Database,
});
