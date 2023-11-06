import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import Patient from "../models/Patient";
import { getData, putData } from "../utils";
import { useLoaderData } from "react-router-dom";

export async function patientDashboardLoader() {
  const [serverPatients, customFields] = await Promise.all([
    getData("/patients"),
    getData("/customfields"),
  ]);
  const patients = serverPatients.map(
    (serverPatient: Patient) => new Patient(serverPatient),
  );
  return { patients, customFields };
}

const defaultColumns: GridColDef[] = [
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = params.props.value.length < 1;
      return { ...params.props, error: hasError };
    },
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = params.props.value.length < 1;
      return { ...params.props, error: hasError };
    },
  },
  {
    field: "middleName",
    headerName: "Middle Name",
    width: 150,
    editable: true,
  },
  // {
  //   field: "status",
  //   headerName: "Status",
  //   width: 150,
  //   editable: true,
  // },
  // {
  //   field: "dob",
  //   headerName: "Date of Birth",
  //   width: 150,
  //   editable: true,
  // },
  // {
  //   field: "addresses",
  //   headerName: "Addresses",
  //   width: 150,
  // },
];

export default function PatientDashboard() {
  const { patients }: { patients: Patient[] } = useLoaderData() as any;
  return (
    <DataGrid
      processRowUpdate={async (updatedRow) => {
        await putData(`/patients/${updatedRow.id}`, updatedRow);
        return updatedRow;
      }}
      rows={patients}
      columns={defaultColumns}
    />
  );
}
