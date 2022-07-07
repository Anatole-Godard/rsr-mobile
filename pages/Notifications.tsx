import React from "react";

import { Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { ResourcesTab } from "components/Notifications/ResourcesTab";
import { MessagesTab } from "components/Notifications/MessagesTab";

const initialLayout = { width: Dimensions.get("window").width };

export const NotificationsScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "resources", title: "Ressources" },
    { key: "messages", title: "Messages" },
  ]);

  const theme = useTheme();

  const renderScene = SceneMap({
    resources: () => <ResourcesTab />,
    messages: () => <MessagesTab />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.text,
      }}
      labelStyle={{ color: theme.colors.text, fontFamily: "Spectral" }}
    />
  );

  return (
    <React.Fragment>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        style={{
          backgroundColor: theme.colors.surface,
        }}
      />
    </React.Fragment>
  );
};
