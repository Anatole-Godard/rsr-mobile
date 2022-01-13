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

    const user = {
        data: {
            _id: "61dd54b50e9bdfb1d20492b5",
            fullName: "Oph test",
            birthDate: "2022-01-11T00:00:00.000Z",
            email: "oph@test.fr",
            password: "azerty123",
            role: "user",
            photoURL: "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
            createdAt: "2022-01-11T09:58:13.119Z",
            __v: 0
        }
    }

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
                      uri: user.data.photoURL,
                    }}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={title}
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
