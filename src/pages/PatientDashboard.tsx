import React, { useContext } from "react";
import { userContext } from "../store/user";

export default function PatientDashboard() {
  const { user } = useContext(userContext);
  return (
    <div>
      Hi {user?.firstName} {user?.lastName}!
    </div>
  );
}
