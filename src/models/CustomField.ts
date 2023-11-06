export type CustomFieldType = "number" | "string" | "date";

export default class CustomField {
  id: number;
  name: string;
  isRequired: boolean;
  defaultValue?: string;
  providerId: number;
  type?: CustomFieldType;

  constructor({
    id,
    name,
    isRequired = false,
    defaultValue,
    providerId,
    type,
  }: {
    id: number;
    name: string;
    isRequired?: boolean;
    defaultValue?: string;
    providerId: number;
    type?: CustomFieldType;
  }) {
    this.id = id;
    this.name = name;
    this.isRequired = isRequired;
    this.defaultValue = defaultValue;
    this.providerId = providerId;
    this.type = type;
  }
}
