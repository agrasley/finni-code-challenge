import React, { useState } from "react";
import { deleteData, getData, postData, putData } from "../utils";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import CustomField from "../models/CustomField";
import { useLoaderData } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NewFieldDialog from "../components/NewFieldDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export async function customFieldsLoader() {
  const customFields = await getData("/customfields");
  return { customFields };
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
        Add field
      </Button>
    </GridToolbarContainer>
  );
}

export default function Fields() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const { customFields }: { customFields: CustomField[] } =
    useLoaderData() as any;
  const [rows, setRows] = useState(customFields);
  const handleSubmit = async (customField: CustomField) => {
    const { id } = await postData("/customfields", customField);
    setRows((rows) => [...rows, { ...customField, id }]);
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteData(`/customfields/${id}`);
    setRows((rows) => rows.filter((row) => row.id !== id));
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Field Name",
      width: 150,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Text", "Number", "Date"],
      valueGetter: ({ value }: GridValueGetterParams) => {
        if (value === "date") {
          return "Date";
        } else if (value === "number") {
          return "Number";
        } else {
          return "Text";
        }
      },
      valueSetter: ({ value, row }: GridValueSetterParams) => {
        let newValue = "string";
        if (value === "Date") {
          newValue = "date";
        } else if (value === "Number") {
          newValue = "number";
        }
        return { ...row, type: newValue };
      },
    },
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
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={async (updatedRow) => {
          await putData(`/customfields/${updatedRow.id}`, updatedRow);
          return updatedRow;
        }}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setDialogOpen },
        }}
      />
      <NewFieldDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        title="Danger"
        description="Are you sure you want to delete this field? All associated data will be lost."
        handleConfirm={async () => {
          await handleDelete(deleteId);
          setDeleteId(0);
          setConfirmDialogOpen(false);
        }}
      />
    </>
  );
}
