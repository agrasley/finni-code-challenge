import dbPromise from "../db";

export default class Provider {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;

  constructor({
    id,
    username,
    firstName,
    lastName,
    password,
  }: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

  static fromDBRow(
    row:
      | {
          id: number;
          username: string;
          first_name: string;
          last_name: string;
          password: string;
        }
      | undefined,
  ): Provider | undefined {
    if (row) {
      return new Provider({
        id: row.id,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        password: row.password,
      });
    }
  }

  static async getByUsername(username: string): Promise<Provider | undefined> {
    const db = await dbPromise;
    return Provider.fromDBRow(
      await db.get("SELECT * FROM provider WHERE username = ?", username),
    );
  }

  async insert() {
    const db = await dbPromise;
    return db.run(
      "INSERT INTO provider (username, first_name, last_name, password) VALUES (?, ?, ?, ?)",
      [this.username, this.firstName, this.lastName, this.password],
    );
  }
}
