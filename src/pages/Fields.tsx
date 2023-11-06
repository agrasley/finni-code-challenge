import React from "react";
import { getData } from "../utils";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
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
  },
  {
    field: "type",
    headerName: "Type",
    width: 150,
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
  },
];

export default function Fields() {
  const { customFields }: { customFields: CustomField[] } =
    useLoaderData() as any;
  return <DataGrid rows={customFields} columns={columns} />;
}
