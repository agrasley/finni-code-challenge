import { Database } from "sqlite3";
import { open } from "sqlite";

open({
  filename: "./database.db",
  driver: Database,
}).then((db) => {
  console.log("got the DB");
});
