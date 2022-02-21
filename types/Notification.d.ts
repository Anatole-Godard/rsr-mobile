import { Channel } from "./Channel";
import { Resource } from "./Resource";
import { UserMinimum } from "./User";

export type Notification = {
  user: UserMinimum;
  emitter: UserMinimum;
  document: Resource | Channel;
  type: "comment" | "mention" | "like" | "message" | "resource_create" | "invite";
  createdAt: Date | string;
};
