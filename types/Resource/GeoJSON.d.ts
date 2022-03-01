export type GeoJSON_Point = {
  type: "Feature" | "FeatureCollection"; // "Feature"
  geometry: {
    type: "Point"; //"Point";
    coordinates: number[]; //[125.6, 10.1];
  };
  properties: {
    name: string; //"Dinagat Islands";
    location: string; //"off the coast of the Philippines";
  };
};

export type GeoJSONPointWithoutRedundancy = {
  type: "Feature" | "FeatureCollection"; // "Feature"
  geometry: {
    type: "Point"; //"Point";
    coordinates: number[]; //[125.6, 10.1];
  };
  properties: {
    name: string;
    location: string;
  };
};
