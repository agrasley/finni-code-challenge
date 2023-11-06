import dbPromise from "../db";

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

  static async getById(id: number) {
    const db = await dbPromise;
    const row = await db.get("SELECT * FROM custom_field WHERE id = ?", id);
    return new CustomField({
      id: row.id,
      name: row.name,
      isRequired: row.is_required,
      defaultValue: row.default_value,
      providerId: row.provider,
      type: row.type,
    });
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
          type: row.type,
        }),
    );
  }

  async update() {
    const db = await dbPromise;
    await db.run("UPDATE custom_field SET name = ?, type = ? WHERE id = ?", [
      this.name,
      this.type,
      this.id,
    ]);
  }

  async insert() {
    const db = await dbPromise;
    return db.run(
      "INSERT INTO custom_field (name, is_required, default_value, provider, type) VALUES (?, ?, ?, ?, ?)",
      [
        this.name,
        this.isRequired,
        this.defaultValue,
        this.providerId,
        this.type,
      ],
    );
  }

  async delete() {
    const db = await dbPromise;
    db.run(
      `UPDATE patient SET custom_fields = json_remove(custom_fields, '$.${this.id}') WHERE provider = ?`,
      [this.providerId],
    );
    return db.run("DELETE FROM custom_field WHERE id = ?", this.id);
  }
}
