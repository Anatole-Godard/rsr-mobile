import { Resource } from "types/Resource";

export type Input = {
  label: string;
  slug: string;
  value: string | number | boolean;
  type: "date" | "string" | "number" | "boolean";
};

export const toModularInput = (
  properties: Resource["data"]["attributes"]["properties"]
): Input[] => {
  if (!properties) throw new Error("properties is required");
  if (!(properties instanceof Object))
    throw new Error("properties must be an object");

  return Object.values(
    (properties as { [key: string]: never | Input }) || []
  ).filter(
    (property) =>
      property?.type !== undefined &&
      property?.label !== undefined &&
      property?.slug !== undefined &&
      property?.value !== undefined
  );
};
