import { Input } from "@components/Helper/ModularInput";
import { Media } from "./Media";

export interface Other {
  properties: {
    [key: string]: Input;
    medias?: Media[];
  };
}
