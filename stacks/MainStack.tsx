import React from "react";

import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar, Avatar } from "react-native-paper";

import { ResourceSlug } from "pages/resource/Slug";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";

import { BottomTabNavigator } from "components/ui/BottomTabNavigator";
import { ChannelSlug } from "pages/channel/Slug";
import { useAuth } from "hooks/useAuth";

import { HOST_URL } from "@env";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const { user } = useAuth();

  const { colorScheme } = usePreferences();

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        header: ({ options, navigation, previous }: any) => {
          // console.log(navigation.getState())

          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : navigation?.route?.name || "f";

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme[colorScheme].colors.surface } }}
              style={{
                backgroundColor: theme[colorScheme].colors.surface,
                elevation: 0,
              }}
            >
              {previous ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme[colorScheme].colors.primary}
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
                  <Avatar.Image
                    children={undefined}
                    size={40}
                    source={{
                      uri: HOST_URL + user.data.photoURL,
                    }}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={title}
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: theme[colorScheme].colors.primary,
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
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="Details"
        component={ResourceSlug}
        options={{ headerTitle: "Tweet" }}
      />
      <Stack.Screen
        name="ChannelSlug"
        component={ChannelSlug}
        options={({ route }) => {
          return {
            headerTitle: (route?.params?.title as unknown as string) || "Home",
          };
        }}
      />
    </Stack.Navigator>
  );
};
