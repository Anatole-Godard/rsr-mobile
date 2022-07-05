import React from 'react';
import {
  BanIcon as BanIconOutline,
  CalendarIcon as CalendarIconOutline,
  GlobeIcon as GlobeIconOutline,
  HandIcon as HandIconOutline,
  LinkIcon as LinkIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  LockClosedIcon as LockClosedIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline
} from 'react-native-heroicons/outline';
import {
  BanIcon as BanIconSolid,
  CalendarIcon as CalendarIconSolid,
  GlobeIcon as GlobeIconSolid,
  HandIcon as HandIconSolid,
  LinkIcon as LinkIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid
} from 'react-native-heroicons/solid';

export const types = [
  {
    label: "Objet physique",
    value: "physical_item",
    hasImage: true,
    icon: { outline: HandIconOutline, solid: HandIconSolid },
  },
  {
    label: "Position",
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
    icon: { outline: LinkIconOutline, solid: LinkIconSolid },
  },
  {
    label: "Événement",
    value: "event",
    hasImage: true,
    icon: { outline: CalendarIconOutline, solid: QuestionMarkCircleIconSolid },
  },
  {
    label: "Personalisé",
    value: "other",
    hasImage: true,
    icon: { outline: QuestionMarkCircleIconOutline, solid: CalendarIconSolid },
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
