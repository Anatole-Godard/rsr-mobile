/* eslint-disable no-unused-vars */
export type Navigation = {
  goBack();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: (scene: string, params?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavigationScreenConfig = any;
