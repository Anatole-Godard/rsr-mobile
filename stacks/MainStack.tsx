import React from "react";

import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar, Avatar, useTheme } from "react-native-paper";

import { ResourceSlug } from "pages/resource/Slug";
import { ChatIcon } from "react-native-heroicons/outline";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";


import { BottomTabNavigator } from "components/ui/BottomTabNavigator";

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        header: ({ options, navigation, previous }: any) => {
          
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : navigation.route.name;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
            >
              {previous ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
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
                      uri: "https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg",
                    }}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={title === "Feed" ? <ChatIcon /> : title}
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: theme.colors.primary,
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
    </Stack.Navigator>
  );
};
