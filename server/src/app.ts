import express from "express";
import session from "express-session";
import connect from "connect-sqlite3";
import path from "path";
import passport from "passport";

const SQLiteStore = connect(session);
const port = 3000;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
      db: "sessions.db",
      dir: path.join(__dirname, "../db"),
    }) as any,
  }),
);
app.use(passport.authenticate("session"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
