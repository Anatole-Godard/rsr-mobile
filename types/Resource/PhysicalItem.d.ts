import { Media } from "./Media";

export type PhysicalItem = {
  properties: {
    name: string;
    description: string;
    medias: Media[];
    price: number | null;
    category: string;
  };
};
