import React from "react";
import {
  LinkIcon as ExternalLinkIconOutline,
  HandIcon as HandIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  LockClosedIcon as LockClosedIconOutline,
  GlobeIcon as GlobeIconOutline,
  BanIcon as BanIconOutline,
  CalendarIcon as CalendarIconOutline,
} from "react-native-heroicons/outline";
import {
  LinkIcon as ExternalLinkIconSolid,
  HandIcon as HandIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  GlobeIcon as GlobeIconSolid,
  BanIcon as BanIconSolid,
  CalendarIcon as CalendarIconSolid,
} from "react-native-heroicons/solid";

export const types = [
  {
    label: "Objet physique",
    value: "physical_item",
    hasImage: true,
    icon: { outline: HandIconOutline, solid: HandIconSolid },
  },
  {
    label: "Emplacement GPS",
    value: "location",
    hasImage: false,
    icon: {
      outline: LocationMarkerIconOutline,
      solid: LocationMarkerIconSolid,
    },
  },
  {
    label: "Lien externe",
    value: "external_link",
    hasImage: true,
    icon: { outline: ExternalLinkIconOutline, solid: ExternalLinkIconSolid },
  },
  {
    label: "Événement",
    value: "event",
    hasImage: true,
    icon: { outline: CalendarIconOutline, solid: CalendarIconSolid },
  },
];

export type ResourceType = {
  label: string;
  value: string;
  hasImage: boolean;
  icon: Icon;
};

export const visibilities = [
  {
    label: "Publique",
    value: "public",
    icon: { outline: GlobeIconOutline, solid: GlobeIconSolid },
  },
  {
    label: "Privée",
    value: "private",
    icon: { outline: LockClosedIconOutline, solid: LockClosedIconSolid },
  },
  {
    label: "Non répertoriée",
    value: "unlisted",
    icon: { outline: BanIconOutline, solid: BanIconSolid },
  },
];

export type ResourceVisibility = {
  label: string;
  value: string;
  icon: Icon;
};

type Icon = {
  outline: (props: React.ComponentProps<typeof BanIconOutline>) => JSX.Element;
  solid: (props: React.ComponentProps<typeof BanIconOutline>) => JSX.Element;
};
