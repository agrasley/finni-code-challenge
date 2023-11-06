import React from "react";
import { getData, putData } from "../utils";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import CustomField from "../models/CustomField";
import { useLoaderData } from "react-router-dom";

export async function customFieldsLoader() {
  const customFields = await getData("/customfields");
  return { customFields };
}

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
];

export default function Fields() {
  const { customFields }: { customFields: CustomField[] } =
    useLoaderData() as any;
  return (
    <DataGrid
      rows={customFields}
      columns={columns}
      processRowUpdate={async (updatedRow) => {
        await putData(`/customfields/${updatedRow.id}`, updatedRow);
        return updatedRow;
      }}
    />
  );
}
