import { User, UserMinimum } from "@definitions/User";
import { Message } from "@definitions/Message";
import { Resource } from "@definitions/Resource";
import { Activity } from "./Activity";

export type Channel = {
  owner: UserMinimum;
  name: string;
  slug: string;
  messages: Message[];
  activities: Activity[];
  members: UserMinimum[];
  createdAt: Date | string;
  image?: any;
  description?: string;
  visibility: "public" | "private";
};

export type ChannelMinimum = {
  owner: UserMinimum;
  name: string;
  slug: string;
  createdAt: Date | string;
  image?: any;
  description?: string;
  visibility: "public" | "private";
};
