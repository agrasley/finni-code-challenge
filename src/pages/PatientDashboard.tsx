import React from "react";

export default function PatientDashboard() {
  const user = JSON.parse(window.localStorage.getItem("user")!);
  return (
    <div>
      Hi {user?.firstName} {user?.lastName}!
    </div>
  );
}
