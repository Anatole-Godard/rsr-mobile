import React, { useState } from "react";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

/// Navigation
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "components/ui/Drawer";
import { StackNavigator } from "stacks/MainStack";
import { AuthProvider } from "hooks/useAuth";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { PreferencesProvider, usePreferences } from "hooks/usePreferences";
import { colors } from "core/theme";

const Drawer = createDrawerNavigator();

/// Main
export default function App() {
  const _colorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    _colorScheme || "light"
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
          <PreferencesProvider
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
          >
            <PaperProvider
              theme={
                
                colorScheme === "light"
                  ? {
                      ...PaperDefaultTheme,
                      colors: {
                        ...PaperDefaultTheme.colors,
                        // ...colors,
                      },
                    }
                  : {
                      ...PaperDarkTheme,
                      colors: {
                        ...PaperDarkTheme.colors,
                        // ...colors,
                      },
                    }
              }
            >
              <RootNavigator />
            </PaperProvider>
          </PreferencesProvider>
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
