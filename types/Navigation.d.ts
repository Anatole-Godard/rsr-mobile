export type Navigation = {
  navigate: (scene: string) => void;
  push: (scene: string, params: any) => void;
  getState?: () => NavigationState;
  setOptions?: (options: NavigationScreenConfig) => void;
};

type NavigationState = {
  routes: NavigationRoute[];
};

type NavigationRoute = {
  state: { history: { key: string }[] };
};

type NavigationScreenConfig = any;
