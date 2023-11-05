import React from "react";
import { getData } from "../utils";

export async function patientDashboardLoader() {
  const patients = await getData("/patients");
  const customFields = await getData("/customfields");
  console.log(patients);
  console.log(customFields);
  return { patients, customFields };
}

export default function PatientDashboard() {
  const user = JSON.parse(window.localStorage.getItem("user")!);
  return (
    <div>
      Hi {user?.firstName} {user?.lastName}!
    </div>
  );
}
