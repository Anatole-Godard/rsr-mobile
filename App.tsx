import React from "react";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  useTheme,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";

/// Navigation
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "components/ui/Drawer";
import { StackNavigator } from "stacks/MainStack";
import { PreferencesContext } from "context/preferencesContext";

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="App"
          options={{
            headerShown: false,
          }}
          component={StackNavigator}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

/// Main
export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );

  function toggleTheme() {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme]
  );

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider
            theme={
              theme === "light"
                ? {
                    ...PaperDefaultTheme,
                    colors: { ...PaperDefaultTheme.colors, primary: "#1ba1f2" },
                  }
                : {
                    ...PaperDarkTheme,
                    colors: { ...PaperDarkTheme.colors, primary: "#1ba1f2" },
                  }
            }
          >
            <RootNavigator />
          </PaperProvider>
        </PreferencesContext.Provider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
