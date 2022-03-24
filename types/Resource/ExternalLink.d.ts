export type ExternalLink = {
  properties: {
    url: string;
    name: string;
    description: string;
    image: any;
  };
};

export type ExternalLinkWithoutRedundancy = {
  url: string;
};
