import React from "react";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import { List, Switch, useTheme } from "react-native-paper";
import { View } from "react-native";
import { ChatAlt2Icon } from "react-native-heroicons/outline";

export const SettingsDisplayScreen = () => {
  const theme = useTheme();
  const { toggleChannelStoriesDisplay, channelStoriesDisplay } =
    usePreferences();
  const { user } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <List.Section>
        <List.Subheader>Page d'accueil</List.Subheader>
        <List.Item
          titleStyle={{
            fontFamily: "Marianne-Bold",
          }}
          descriptionStyle={{
            fontFamily: "Spectral",
            fontSize: 13,
          }}
          title='Vue "Stories" des salons'
          description="Affichage ou non des salons sur la page d'accueil"
          left={(props) => (
            <List.Icon
              {...props}
              icon={(props) => <ChatAlt2Icon {...props} />}
              style={{ marginHorizontal: 0 }}
            />
          )}
          right={(props) => (
            <Switch
              style={{ marginTop: 10 }}
              value={channelStoriesDisplay}
              onValueChange={toggleChannelStoriesDisplay}
            />
          )}
        />
      </List.Section>
    </View>
  );
};
