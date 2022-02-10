import { DarkTheme, DefaultTheme } from "react-native-paper";

export const theme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#000091",
      secondary: "#414757",
      error: "#f13a59",
    },
  },
  [undefined]: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#000091",
      secondary: "#414757",
      error: "#f13a59",
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#66BAA8",

      secondary: DarkTheme.colors.text,
    },
  },
};

export const colors = {
  primary: "#000091",
  secondary: "#414757",
  error: "#f13a59",
};
