export type CustomFieldType = "number" | "string" | "date";

type CustomField = {
  id: number;
  name: string;
  type?: CustomFieldType;
};

export default CustomField;
