import React from "react";
import color from "color";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Portal, FAB } from "react-native-paper";
import { useSafeArea } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import overlay from "libs/overlay";
import { ResourcesScreen } from "pages/resource/All";
import { HomeScreen } from "pages/Home";
import { ChannelScreen } from "pages/channel/All";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import { Navigation } from "types/Navigation";
import {
  ChatAlt2Icon,
  HomeIcon,
  ShoppingBagIcon,
} from "react-native-heroicons/outline";
import { useDrawerStatus } from "@react-navigation/drawer";

const Tab = createMaterialBottomTabNavigator();

type Props = {
  navigation: Navigation;
};

export const BottomTabNavigator = (props: Props) => {
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  const { colorScheme } = usePreferences();
  const isDrawerOpen = useDrawerStatus() === "open";

  const tabBarColor = theme.dark
    ? (overlay(6, theme[colorScheme].colors.surface) as string)
    : theme[colorScheme].colors.surface;

  let history = props.navigation.getState()?.routes?.[0]?.state?.history;
  let state = history?.[history.length - 1]?.key?.split("-")?.[0]?.toString() || "Accueil";

  return (
    <React.Fragment>
      <Tab.Navigator
        barStyle={{
          backgroundColor: tabBarColor,
          elevation: 0,
        }}
        initialRouteName="Accueil"
        backBehavior="initialRoute"
        shifting={true}
        activeColor={theme[colorScheme].colors.primary}
        inactiveColor={color(theme[colorScheme].colors.text)
          .alpha(0.6)
          .rgb()
          .string()}
        sceneAnimationEnabled={false}
        style={{
          elevation: 0,
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeScreen}
          options={{
            tabBarIcon: (props) => <HomeIcon color={props.color} />,
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Catalogue"
          component={ResourcesScreen}
          options={{
            tabBarIcon: (props) => <ShoppingBagIcon color={props.color} />,
            tabBarColor,
          }}
        />

        <Tab.Screen
          name="Salons"
          component={ChannelScreen}
          options={{
            tabBarIcon: (props) => <ChatAlt2Icon color={props.color} />,
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      {(state === "Salons" || state === "Accueil") && !isDrawerOpen && (
        <Portal>
          <FAB
            visible={isFocused}
            icon="plus"
            style={{
              position: "absolute",
              bottom: safeArea.bottom + 65,
              right: 16,
              borderRadius: 16,
              elevation: 1,
            }}
            color="white"
            theme={{
              colors: {
                accent: theme[colorScheme].colors.primary,
              },
            }}
            onPress={() => {
              props.navigation.navigate(
                state === "Salons" ? "ChannelCreate" : "ResourceCreate"
              );
            }}
          />
        </Portal>
      )}
    </React.Fragment>
  );
};
