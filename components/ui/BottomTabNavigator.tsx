import React from "react";
import color from "color";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Portal, FAB, Badge } from "react-native-paper";
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
  BellIcon,
  ChatAlt2Icon,
  HomeIcon,
  ShoppingBagIcon,
} from "react-native-heroicons/outline";
import {
  BellIcon as BellIconSolid,
  ChatAlt2Icon as ChatAlt2IconSolid,
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
} from "react-native-heroicons/solid";
import { useDrawerStatus } from "@react-navigation/drawer";
import { NotificationsScreen } from "pages/Notifications";
import { View } from "react-native";
import { useNotifications } from "hooks/useNotifications";

const Tab = createMaterialBottomTabNavigator();

type Props = {
  navigation: Navigation;
};

export const BottomTabNavigator = (props: Props) => {
  const { notifications } = useNotifications();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  const { colorScheme } = usePreferences();
  const isDrawerOpen = useDrawerStatus() === "open";

  const tabBarColor = theme.dark
    ? (overlay(6, theme[colorScheme].colors.surface) as string)
    : theme[colorScheme].colors.surface;

  let history = props.navigation.getState()?.routes?.[0]?.state?.history;
  let state =
    history?.[history.length - 1]?.key?.split("-")?.[0]?.toString() ||
    "Accueil";

  return (
    <React.Fragment>
      <Tab.Navigator
        barStyle={{
          backgroundColor: tabBarColor,
          elevation: 5,
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
        labeled={false}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeScreen}
          options={{
            tabBarIcon: (props) =>
              props.focused ? (
                <HomeIconSolid color={props.color} />
              ) : (
                <HomeIcon color={props.color} />
              ),
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Catalogue"
          component={ResourcesScreen}
          options={{
            tabBarIcon: (props) =>
              props.focused ? (
                <ShoppingBagIconSolid color={props.color} />
              ) : (
                <ShoppingBagIcon color={props.color} />
              ),
            tabBarColor,
          }}
        />

        <Tab.Screen
          name="Salons"
          component={ChannelScreen}
          options={{
            tabBarIcon: (props) =>
              props.focused ? (
                <ChatAlt2IconSolid color={props.color} />
              ) : (
                <ChatAlt2Icon color={props.color} />
              ),
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarIcon: (props) => (
              <View>
                <Badge
                  visible={notifications && notifications.length > 0}
                  size={8}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    zIndex: 1,
                  }}
                >
                  {/* {notifications.length} */}
                </Badge>
                {props.focused ? (
                  <BellIconSolid color={props.color} />
                ) : (
                  <BellIcon color={props.color} />
                )}
              </View>
            ),
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
