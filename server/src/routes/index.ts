import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Patient from "../models/Patient";
import CustomField from "../models/CustomField";
import Address from "../models/Address";

const router = express.Router();
const loggedIn = ensureLoggedIn();

router.get("/patients", loggedIn, async function (req, res) {
  const patients = await Patient.getByProvider(req.user!.id);
  res.json(patients.reverse());
});

router.post("/patients", loggedIn, async function (req, res) {
  const { id: providerId } = req.user!;
  const patientResult = await new Patient({ ...req.body, providerId }).insert();
  res.json({ id: patientResult.lastID });
});

router.put("/patients/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  if (id !== `${req.body.id}`) {
    return res.status(400).send("Id of body and param mismatch");
  }
  const oldPatient = await Patient.getById(req.body.id);
  if (oldPatient.providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to edit that patient");
  }
  const patient = new Patient(req.body);
  await patient.update();
  res.json({ success: true });
});

router.delete("/patients/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  const patient = await Patient.getById(Number(id));
  if (patient.providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to delete that patient");
  }
  await patient.delete();
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

router.delete("/customfields/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  const customField = await CustomField.getById(Number(id));
  if (customField.providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to delete that field");
  }
  await customField.delete();
  res.json({ success: true });
});

router.post("/addresses", loggedIn, async function (req, res) {
  const addresses: Address[] = req.body.map(
    (address: Address) => new Address(address),
  );
  const patientIdSet = addresses.reduce(
    (set, address) => set.add(address.patientId!),
    new Set<number>(),
  );
  if (patientIdSet.size > 1) {
    return res
      .status(400)
      .send("All addresses should belong to the same patient");
  }
  const patientId = patientIdSet.values().next().value;
  const { providerId } = await Patient.getById(patientId);
  if (providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to create addresses for this patient");
  }
  const results = await Promise.all(
    addresses.map((address) => address.insert()),
  );
  res.json({ ids: results.map((result) => result.lastID) });
});

router.put("/addresses/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  const oldAddress = await Address.getById(Number(id));
  const patient = await Patient.getById(oldAddress.patientId!);
  if (patient.providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to edit addresses for this patient");
  }
  await new Address(req.body).update();
  res.json({ success: true });
});

router.delete("/addresses/:id", loggedIn, async function (req, res) {
  const { id } = req.params;
  const address = await Address.getById(Number(id));
  const patient = await Patient.getById(address.patientId!);
  if (patient.providerId !== req.user!.id) {
    return res
      .status(403)
      .send("You do not have permission to delete addresses for this patient");
  }
  await address.delete();
  res.json({ success: true });
});

export default router;
