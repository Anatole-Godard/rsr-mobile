import { UserMinimum } from "../User";

export type TagDocument = {
  _id: string;
  owner: UserMinimum;
  name: string;
  createdAt: Date | string;
  validated: boolean;
};

export type Tag = string[];
