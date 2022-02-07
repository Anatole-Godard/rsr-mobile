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
import { AuthProvider } from "hooks/useAuth";
import { colors } from "core/theme";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const Drawer = createDrawerNavigator();

/// Main
export default function App() {
  const colorScheme = useColorScheme();
  // const themePaper = useTheme();
  // const navigationTheme = themePaper.dark ? DarkTheme : DefaultTheme;
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

  let [fontsLoaded] = useFonts({
    Marianne: require("./assets/fonts/Marianne-Regular.ttf"),
    "Marianne-ExtraBold": require("./assets/fonts/Marianne-ExtraBold.ttf"),
    Spectral: require("./assets/fonts/Spectral-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
      // theme={navigationTheme}
      >
        <AuthProvider>
          <AppearanceProvider>
            <PreferencesContext.Provider value={preferences}>
              <PaperProvider
                theme={
                  PaperDefaultTheme
                  // theme === "light"
                  //   ? {
                  //       ...PaperDefaultTheme,
                  //       colors: {
                  //         ...PaperDefaultTheme.colors,
                  //         ...colors,
                  //       },
                  //     }
                  //   : {
                  //       ...PaperDarkTheme,
                  //       colors: {
                  //         ...PaperDarkTheme.colors,
                  //         ...colors,
                  //       },
                  //     }
                }
              >
                <RootNavigator />
              </PaperProvider>
            </PreferencesContext.Provider>
          </AppearanceProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export const RootNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="App"
        options={{
          headerShown: false,
        }}
        component={StackNavigator}
      />
    </Drawer.Navigator>
  );
};
