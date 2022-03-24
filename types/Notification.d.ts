import { ChannelMinimum } from "./Channel";
import { ResourceMinimum } from "./Resource";
import { UserMinimum } from "./User";

export type Notification = {
  _id?: string;
  user: UserMinimum;
  emitter?: UserMinimum;
  document?: ResourceMinimum | ChannelMinimum ;
  type:
    | "comment"
    | "mention"
    | "like"
    | "message"
    | "resource_create"
    | "invite"
    | "report";
  createdAt: Date | string;
};
