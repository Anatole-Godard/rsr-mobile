export const types: ResourceType[] = [
  {
    label: "Objet physique",
    value: "physical_item",
    hasImage: true,
  },
  {
    label: "Emplacement GPS",
    value: "location",
    hasImage: false,
  },
  {
    label: "Lien externe",
    value: "external_link",
    hasImage: true,
  },
];

export type ResourceType = {
  label: string;
  value: string;
  hasImage: boolean;
};
