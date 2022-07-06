import { Comment } from "./Resource/Comment";
import { Event } from "./Resource/Event";
import type { ExternalLink } from "./Resource/ExternalLink";
import type { GeoJSON_Point } from "./Resource/GeoJSON";
import type { PhysicalItem } from "./Resource/PhysicalItem";
import { TagDocument } from "./Resource/Tag";
import type { UserMinimum } from "./User";

export type Resource = {
  slug: string;
  owner: UserMinimum;
  createdAt: Date | string;
  description?: string;
  tags?: TagDocument[] | string[];
  data: {
    type: "location" | "physical_item" | "external_link" | "event" | "other";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: GeoJSON_Point | PhysicalItem | ExternalLink | Event | any;
  };
  likes: UserMinimum[];
  comments?: Comment[];
  validated: boolean;
  seenBy: UserMinimum[];
  visibility: "public" | "private" | "unlisted";
  members?: UserMinimum[];
  updatedAt: Date | string;
};

export type ResourceMinimum = {
  slug: string;
  owner: UserMinimum;
  createdAt: Date | string;
  description?: string;
  tags?: TagDocument[] | string[];
  data: {
    type: "location" | "physical_item" | "external_link" | "event" | "other";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: GeoJSON_Point | PhysicalItem | ExternalLink | Event | any;
  };
  validated: boolean;
  visibility: "public" | "private" | "unlisted";
  members?: UserMinimum[];
  seenBy: UserMinimum[];
  updatedAt: Date | string;
};
