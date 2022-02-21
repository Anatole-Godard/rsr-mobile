import React from "react";

import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar } from "react-native-paper";

import { ResourceSlug } from "pages/resource/Slug";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";

import { BottomTabNavigator } from "components/ui/BottomTabNavigator";
import { ChannelSlug } from "pages/channel/Slug";

import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import { ResourceCreate } from "pages/resource/Create";
import { MenuIcon } from "react-native-heroicons/outline";
import { ChannelCreate } from "pages/channel/Create";
import { ProfileScreen } from "pages/Profile";

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const { colorScheme } = usePreferences();

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        header: ({ options, navigation, back }: any) => {
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : navigation?.route?.name || "";

          const subtitle =
            (options.subtitle !== undefined
              ? options.subtitle
              : navigation?.route?.name) || undefined;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme[colorScheme].colors.surface } }}
              style={{
                backgroundColor:
                  colorScheme === "light"
                    ? theme.light.colors.surface
                    : theme.dark.colors.background,
                elevation: 0,
                justifyContent: "flex-start",
              }}
            >
              {back ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme[colorScheme].colors.text}
                  size={20}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    (
                      navigation as any as DrawerNavigationProp<{}>
                    ).openDrawer();
                  }}
                >
                  <MenuIcon
                    size={24}
                    color={
                      theme[colorScheme === "dark" ? "light" : "dark"].colors
                        .surface
                    }
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={title}
                subtitle={subtitle}
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontFamily: "Marianne-ExtraBold",
                  color:
                    theme[colorScheme === "dark" ? "light" : "dark"].colors
                      .surface,
                }}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Accueil";
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="Details"
        component={ResourceSlug}
        options={{ headerTitle: "Ressource" }}
      />

      <Stack.Screen
        name="ResourceCreate"
        component={ResourceCreate}
        options={{ headerTitle: "Créer une ressource" }}
      />
      <Stack.Screen
        name="ChannelCreate"
        component={ChannelCreate}
        options={{ headerTitle: "Créer un salon" }}
      />

      <Stack.Screen
        name="ChannelSlug"
        component={ChannelSlug}
        options={({ route }) => {
          return {
            headerTitle:
              ((route?.params as unknown as { name?: string })
                ?.name as unknown as string) || "Salons",
          };
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => {
          return {
            headerTitle:
              ((route?.params as unknown as { fullName?: string })
                ?.fullName as unknown as string) || "Profil",
          };
        }}
      />
    </Stack.Navigator>
  );
};
