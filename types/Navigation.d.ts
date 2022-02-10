export type Navigation = {
  navigate: (scene: string) => void;
  push: (scene: string, params: any) => void;
};
