import { Media } from "./Media";

export type ExternalLink = {
  properties: {
    url: string;
    name: string;
    description: string;
    medias: Media[];
  };
};

export type ExternalLinkWithoutRedundancy = {
  url: string;
};
