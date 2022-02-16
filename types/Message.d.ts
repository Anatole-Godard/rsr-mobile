import { UserMinimum } from "@definitions/User";
import { Resource } from "@definitions/Resource";

export type Message = {
  _id?: string;
  user: UserMinimum;
  data: {
    type: "message";
    text: string;
  };
  createdAt: string;
};
