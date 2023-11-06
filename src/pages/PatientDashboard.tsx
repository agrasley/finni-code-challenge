import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import Patient, { Address } from "../models/Patient";
import { getAge, getData, putData } from "../utils";
import { useLoaderData } from "react-router-dom";
import Chip, { ChipProps } from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

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

function DisplayStatus({ value }: GridRenderCellParams) {
  let color: ChipProps["color"] = "default";
  if (value === "Inquiry") {
    color = "secondary";
  } else if (value === "Onboarding") {
    color = "info";
  } else if (value === "Active") {
    color = "success";
  }
  return <Chip color={color} label={value} />;
}

function DisplayAddress({ address }: { address: Address }) {
  const line2 = address.line2 ? `${address.line2} ` : "";
  const addressString = `${address.line1} ${line2}${address.city}, ${address.state} ${address.zip}`;
  return (
    <ListItem>
      <ListItemText primary={addressString} />
    </ListItem>
  );
}

function DisplayAddresses({ value: addresses }: GridRenderCellParams) {
  return (
    <List dense>
      {addresses.map((address: Address) => (
        <DisplayAddress key={address.id} address={address} />
      ))}
    </List>
  );
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
  {
    field: "status",
    headerName: "Status",
    width: 125,
    editable: true,
    renderCell: (params: GridRenderCellParams) => <DisplayStatus {...params} />,
    type: "singleSelect",
    valueOptions: ["Inquiry", "Onboarding", "Active", "Churned"],
  },
  {
    field: "dob",
    headerName: "Date of Birth",
    width: 110,
    editable: true,
    type: "date",
    valueGetter: (params: GridValueGetterParams) => new Date(params.value),
    valueSetter: (params: GridValueSetterParams) => ({
      ...params.row,
      dob: params.value.toLocaleDateString("en-US"),
    }),
  },
  {
    field: "age",
    headerName: "Age",
    width: 75,
    type: "number",
    valueGetter: (params: GridValueGetterParams) => getAge(params.row.dob),
  },
  {
    field: "addresses",
    headerName: "Addresses",
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <DisplayAddresses {...params} />
    ),
  },
];

export default function PatientDashboard() {
  const { patients }: { patients: Patient[] } = useLoaderData() as any;
  return (
    <DataGrid
      getRowHeight={() => "auto"}
      processRowUpdate={async (updatedRow) => {
        await putData(`/patients/${updatedRow.id}`, updatedRow);
        return updatedRow;
      }}
      rows={patients}
      columns={defaultColumns}
    />
  );
}
