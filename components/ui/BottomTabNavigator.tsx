import React from "react";
import color from "color";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme, Portal, FAB } from "react-native-paper";
import { useSafeArea } from "react-native-safe-area-context";
import { useIsFocused, RouteProp } from "@react-navigation/native";

import overlay from "libs/overlay";
import { ChannelSlug } from "pages/channel/Slug";
import { HomeScreen } from "pages/Home";
import { StackNavigatorParamlist } from "types/StackNavigatorParamList";
import {ChannelList} from "pages/channel/List";

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<StackNavigatorParamlist, "FeedList">;
};

export const BottomTabNavigator = (props: Props) => {
  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="initialRoute"
        shifting={true}
        activeColor={theme.colors.primary}
        inactiveColor={color(theme.colors.text).alpha(0.6).rgb().string()}
        sceneAnimationEnabled={false}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: "home-account",
            tabBarColor,
          }}
        />
        
        <Tab.Screen
          name="Channel"
          component={ChannelList}
          options={{
            tabBarIcon: "message-text-outline",
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused}
          icon="plus"
          style={{
            position: "absolute",
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          onPress={() => {}}
        />
      </Portal>
    </React.Fragment>
  );
};
