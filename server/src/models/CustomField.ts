import dbPromise from "../db";

export default class CustomField {
  id: number;
  name: string;
  isRequired: boolean;
  defaultValue?: string;
  providerId: number;

  constructor({
    id,
    name,
    isRequired = false,
    defaultValue,
    providerId,
  }: {
    id: number;
    name: string;
    isRequired?: boolean;
    defaultValue?: string;
    providerId: number;
  }) {
    this.id = id;
    this.name = name;
    this.isRequired = isRequired;
    this.defaultValue = defaultValue;
    this.providerId = providerId;
  }

  static async getByProvider(providerId: number) {
    const db = await dbPromise;
    const rows = await db.all(
      "SELECT * FROM custom_field WHERE provider = ?",
      providerId,
    );
    return rows.map(
      (row) =>
        new CustomField({
          id: row.id,
          name: row.name,
          isRequired: row.is_required,
          defaultValue: row.default_value,
          providerId: row.provider,
        }),
    );
  }

  async insert() {
    const db = await dbPromise;
    return db.run(
      "INSERT INTO custom_field (name, is_required, default_value, provider) VALUES (?, ?, ?, ?)",
      [this.name, this.isRequired, this.defaultValue, this.providerId],
    );
  }
}
