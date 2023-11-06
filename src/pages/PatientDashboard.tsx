import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRenderEditCellParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import Patient from "../models/Patient";
import { getData, putData } from "../utils";
import { useLoaderData } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip, { ChipProps } from "@mui/material/Chip";

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

function EditStatus({ id, value, field, hasFocus }: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>();

  React.useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleValueChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <FormControl fullWidth>
      <Select
        ref={ref}
        id="status-select"
        value={value}
        label="Status"
        onChange={handleValueChange}
      >
        <MenuItem value="Inquiry">Inquiry</MenuItem>
        <MenuItem value="Onboarding">Onboarding</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Churned">Churned</MenuItem>
      </Select>
    </FormControl>
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
    width: 150,
    editable: true,
    renderCell: (params: GridRenderCellParams) => <DisplayStatus {...params} />,
    renderEditCell: (params: GridRenderEditCellParams) => (
      <EditStatus {...params} />
    ),
  },
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
