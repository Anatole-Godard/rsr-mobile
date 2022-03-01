import { Comment } from "./Resource/Comment";
import { Event } from "./Resource/Event";
import type { ExternalLink } from "./Resource/ExternalLink";
import type { GeoJSON_Point } from "./Resource/GeoJSON";
import type { PhysicalItem } from "./Resource/PhysicalItem";
import type { UserMinimum } from "./User";

export type Resource = {
  slug: string;
  owner: UserMinimum;
  createdAt: Date | string;
  description?: string;
  tags?: string[];
  data: {
    type: "location" | "physical_item" | "external_link" | "event" | string;
    attributes: GeoJSON_Point | PhysicalItem | ExternalLink | Event | any;
  };
  likes: UserMinimum[];
  comments?: Comment[];
  validated: boolean;

  visibility: "public" | "private" | "unlisted";
  members?: UserMinimum[];
};

export type ResourceMinimum = {
  slug: string;
  owner: UserMinimum;
  createdAt: Date | string;
  description?: string;
  tags?: string[];
  data: {
    type: "location" | "physical_item" | "external_link" | "event" | string;
    attributes: {
      properties: {
        name: string;
      };
    };
  };
  validated: boolean;
  visibility: "public" | "private" | "unlisted";
  members?: UserMinimum[];
};
