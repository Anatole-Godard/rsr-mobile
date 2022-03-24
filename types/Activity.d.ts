import { Resource } from "./Resource";
import { UserMinimum } from "./User";

export type Activity = {
  _id?: string;
  user: UserMinimum;
  data: {
    type:
      | "comment"
      | "mention"
      | "like"
      | "message"
      | "resource_create"
      | "invite";
    resource?: Resource;
    user?: UserMinimum;
    text?: "la ressource est bien";
  };
  createdAt: Date | string;
};
