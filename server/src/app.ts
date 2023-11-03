import createError from "http-errors";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import connect from "connect-sqlite3";
import path from "path";
import passport from "passport";
import logger from "morgan";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

const SQLiteStore = connect(session);
const port = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
