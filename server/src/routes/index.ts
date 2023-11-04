import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Patient from "../models/Patient";
import CustomField from "../models/CustomField";

const router = express.Router();
const loggedIn = ensureLoggedIn();

router.get("/patients", loggedIn, async function (req, res) {
  const patients = await Patient.getByProvider(req.user!.id);
  res.json(patients);
});

router.get("/customfields", loggedIn, async function (req, res) {
  const customFields = await CustomField.getByProvider(req.user!.id);
  res.json(customFields);
});

export default router;
