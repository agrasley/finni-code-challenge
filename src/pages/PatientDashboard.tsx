import React from "react";
import { getData } from "../utils";

export async function patientDashboardLoader() {
  const [patients, customFields] = await Promise.all([
    getData("/patients"),
    getData("/customfields"),
  ]);
  return { patients, customFields };
}

export default function PatientDashboard() {
  return <div>TODO: patient dashboard</div>;
}
