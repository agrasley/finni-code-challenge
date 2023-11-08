import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditStartParams,
  GridCellEditStopParams,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridToolbarContainer,
  GridValueGetterParams,
  GridValueSetterParams,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid";
import Patient, { Address } from "../models/Patient";
import { deleteData, getAge, getData, postData, putData } from "../utils";
import { useLoaderData } from "react-router-dom";
import Chip, { ChipProps } from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CustomField from "../models/CustomField";
import EditIcon from "@mui/icons-material/Edit";
import AddressEditDialog from "../components/AddressEditDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import NewPatientDialog from "../components/NewPatientDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export async function patientDashboardLoader() {
  const [patients, customFields] = await Promise.all([
    getData("/patients"),
    getData("/customfields"),
  ]);
  return { patients, customFields };
}

type EditToolbarProps = {
  setDialogOpen: (open: boolean) => void;
};

function EditToolbar({ setDialogOpen }: EditToolbarProps) {
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
      >
        New Patient
      </Button>
    </GridToolbarContainer>
  );
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
    editable: true,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <DisplayAddresses {...params} />
    ),
    renderEditCell: () => <EditIcon />,
  },
  {
    field: "city",
    headerName: "City/Cities",
    width: 150,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.addresses.map((address: Address) => address.city).join(", "),
  },
  {
    field: "zip",
    headerName: "Zip Code(s)",
    width: 150,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.addresses.map((address: Address) => address.zip).join(", "),
  },
];

export default function PatientDashboard() {
  const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressPatientId, setAddressPatientId] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const {
    patients,
    customFields,
  }: { patients: Patient[]; customFields: CustomField[] } =
    useLoaderData() as any;
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState(patients);
  const customColumns = customFields.map((customField) => ({
    field: customField.name,
    headerName: customField.name,
    width: 150,
    type: customField.type,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => {
      const value = params.row.customFields[customField.id];
      if (
        customField.type === "date" &&
        value !== undefined &&
        value !== null
      ) {
        return new Date(value);
      }
      return value;
    },
    valueSetter: (params: GridValueSetterParams) => ({
      ...params.row,
      customFields: {
        ...params.row.customFields,
        [customField.id]: params.value,
      },
    }),
  }));

  const handleDelete = async (id: number) => {
    await deleteData(`/patients/${id}`);
    setRows((rows) => rows.filter((row) => row.id !== id));
  };

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        getRowHeight={() => "auto"}
        processRowUpdate={async (updatedRow) => {
          await putData(`/patients/${updatedRow.id}`, updatedRow);
          return updatedRow;
        }}
        rows={rows}
        columns={[
          ...defaultColumns,
          ...customColumns,

          {
            field: "actions",
            type: "actions",
            width: 80,
            getActions: (params) => [
              <GridActionsCellItem
                key={1}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                  setDeleteId(params.id as unknown as number);
                  setConfirmDialogOpen(true);
                }}
              />,
            ],
          },
        ]}
        onCellEditStart={(params: GridCellEditStartParams) => {
          if (params.field === "addresses") {
            setAddressPatientId(params.row.id);
            setAddresses(params.row.addresses);
            setAddressDialogOpen(true);
          }
        }}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          if (params.field === "addresses") {
            event.defaultMuiPrevented = true;
          }
        }}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setDialogOpen: setNewPatientDialogOpen },
        }}
      />
      <AddressEditDialog
        open={addressDialogOpen}
        handleClose={() => setAddressDialogOpen(false)}
        rowAddresses={addresses}
        patientId={addressPatientId}
        handleSubmit={async ({ deletedIds, changedIds, addresses }) => {
          const changedAddresses = addresses.filter((address) =>
            changedIds.includes(address.id),
          );
          const newAddresses = addresses.filter((address) => address.isNew);
          const promises: Promise<void>[] = [];
          if (newAddresses.length) {
            const { ids }: { ids: number[] } = await postData(
              "/addresses",
              newAddresses,
            );
            ids.forEach((id, idx) => {
              newAddresses[idx].id = id;
            });
          }
          if (deletedIds.length) {
            promises.concat(
              deletedIds.map((id) => deleteData(`/addresses/${id}`)),
            );
          }
          if (changedAddresses.length) {
            promises.concat(
              changedAddresses.map((address) =>
                putData(`/addresses/${address.id}`, address),
              ),
            );
          }
          await Promise.all(promises);
          const value = [
            ...addresses.filter((address) => !address.isNew),
            ...newAddresses,
          ];
          console.log("New value", value);
          apiRef.current.setEditCellValue({
            id: addressPatientId,
            field: "addresses",
            value,
          });
          apiRef.current.stopCellEditMode({
            id: addressPatientId,
            field: "addresses",
          });
        }}
      />
      <NewPatientDialog
        customFields={customFields}
        open={newPatientDialogOpen}
        handleClose={() => setNewPatientDialogOpen(false)}
        handleSubmit={async (patient: Patient) => {
          const { id } = await postData("/patients", patient);
          setRows([{ ...patient, id }, ...rows]);
        }}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        title="Danger"
        description="Are you sure you want to delete this patient?"
        handleConfirm={async () => {
          await handleDelete(deleteId);
          setDeleteId(0);
          setConfirmDialogOpen(false);
        }}
      />
    </>
  );
}
