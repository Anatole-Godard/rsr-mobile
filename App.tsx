import "react-native-gesture-handler";
import "core/ignoreWarnings";
import React, { useState } from "react";

/// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "components/ui/Drawer";
import { StackNavigator } from "stacks/MainStack";
const Drawer = createDrawerNavigator();

/// Hooks and utils
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { AuthProvider } from "hooks/useAuth";
import { useFonts } from "expo-font";
import { PreferencesProvider } from "hooks/usePreferences";
import { theme } from "core/theme";
import { ToastProvider } from "react-native-paper-toast";
import { NotificationProvider } from "hooks/useNotifications";

import { registerTranslation } from "react-native-paper-dates";
import { fr } from "constants/react-native-paper-dates.translate";
registerTranslation("fr", fr);

/// Main
export default function App() {
  const _colorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    _colorScheme || "light"
  );

  const [fontsLoaded] = useFonts({
    Marianne: require("./assets/fonts/Marianne-Regular.ttf"),
    "Marianne-Bold": require("./assets/fonts/Marianne-Bold.ttf"),
    "Marianne-ExtraBold": require("./assets/fonts/Marianne-ExtraBold.ttf"),
    Spectral: require("./assets/fonts/Spectral-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
      // theme={navigationTheme}
      >
        <PaperProvider theme={theme[colorScheme]}>
          <PreferencesProvider
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
          >
            <AuthProvider>
              <NotificationProvider>
                <ToastProvider>
                  <RootNavigator />
                </ToastProvider>
              </NotificationProvider>
            </AuthProvider>
          </PreferencesProvider>
        </PaperProvider>
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
