import { UserMinimum } from "@definitions/User";

export type Message = {
  _id?: string;
  user: UserMinimum;
  data: {
    type: "message";
    text: string;
  };
  createdAt: string;
};
