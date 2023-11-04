import { createContext } from "react";

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;

  constructor({
    id,
    username,
    firstName,
    lastName,
  }: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  }) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

type UserContext = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const userContext = createContext<UserContext>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});
