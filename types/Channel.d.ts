import { UserMinimum } from "@definitions/User";
import { Message } from "@definitions/Message";
import { Activity } from "./Activity";
import { Media } from "./Resource/Media";

export type Channel = {
  owner: UserMinimum;
  name: string;
  slug: string;
  messages: Message[];
  activities: Activity[];
  members: UserMinimum[];
  createdAt: Date | string;
  image?: Media;
  description?: string;
  visibility: "public" | "private";
};

export type ChannelMinimum = {
  owner: UserMinimum;
  name: string;
  slug: string;
  createdAt: Date | string;
  image?: Media;
  description?: string;
  visibility: "public" | "private";
};
