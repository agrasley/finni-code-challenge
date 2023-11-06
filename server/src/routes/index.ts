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

router.put("/patients/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  if (id !== `${req.body.id}`) {
    return res.status(400).send("Id of body and param mismatch");
  }
  const patient = new Patient(req.body);
  await patient.update();
  res.json({ success: true });
});

router.get("/customfields", loggedIn, async function (req, res) {
  const customFields = await CustomField.getByProvider(req.user!.id);
  res.json(customFields);
});

router.post("/customfields", loggedIn, async function (req, res) {
  const customField = new CustomField({
    ...req.body,
    providerId: req.user!.id,
  });
  const result = await customField.insert();
  res.json({ id: result.lastID });
});

router.put("/customfields/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  if (id !== `${req.body.id}`) {
    return res.status(400).send("Id of body and param mismatch");
  }
  const customField = new CustomField(req.body);
  await customField.update();
  res.json({ success: true });
});

export default router;
