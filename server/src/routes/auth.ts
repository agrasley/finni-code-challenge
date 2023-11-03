import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Provider from "../models/Provider";

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const provider = await Provider.getByUsername(username);
    if (!provider)
      return cb(null, false, { message: "Incorrect username or password." });
    if (provider.password === password) {
      return cb(null, provider);
    }
    return cb(null, false, { message: "Incorrect username or password." });
  }),
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user as any);
  });
});

const router = express.Router();

router.post(
  "/login/password",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
