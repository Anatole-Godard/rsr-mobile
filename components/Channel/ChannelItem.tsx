import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Channel } from "types/Channel";
import { Swipeable } from "react-native-gesture-handler";
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper";
import { usePreferences } from "hooks/usePreferences";
import { colors } from "core/theme";
import { HOST_URL } from "constants/env";
import { formatDistance } from "date-fns";
import { Activity } from "types/Activity";
import { Message } from "types/Message";
import fr from "date-fns/locale/fr";
import { TrashIcon, UsersIcon } from "react-native-heroicons/outline";

export interface ChannelItemProps extends Channel {
  onPress: () => void;
}

const RightAction = ({ slug }: { slug: string }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: "#FF4F5B",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <TouchableOpacity
        onPress={() => console.log("quit" + slug)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          width: 132,
          flexDirection: "row",
        }}
      >
        <TrashIcon size={24} color={theme.colors.surface} />
        <Text
          style={{
            color: theme.colors.surface,
            marginLeft: 8,
            fontFamily: "Marianne-ExtraBold",
          }}
        >
          Quitter
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const ChannelItem = (props: ChannelItemProps) => {
  const { colorScheme } = usePreferences();
  const [history, setHistory] = useState<(Activity | Message)[]>([]);

  useEffect(() => {
    setHistory(
      [...props.messages, ...props.activities].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );

    return () => setHistory([]);
  }, [props.messages, props.activities]);

  return (
    <Swipeable renderRightActions={() => <RightAction slug={props.slug} />}>
      <TouchableRipple onPress={props.onPress}>
        <Surface style={styles.container}>
          {props.image ? (
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor:
                  colorScheme === "light" ? colors.blue[200] : colors.blue[800],
              }}
            >
              <Image
                source={{ uri: HOST_URL + props.image.url }}
                style={styles.image}
              />
            </View>
          ) : (
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor:
                  colorScheme === "light" ? colors.blue[200] : colors.blue[800],
              }}
            >
              <UsersIcon size={24} color={colors.blue[500]} />
            </View>
          )}
          <View style={styles.rightColumn}>
            <View style={styles.header}>
              <Text style={styles.title}>{props.name}</Text>
              <Text style={styles.time}>
                {history.length > 0
                  ? formatDistance(
                      new Date(history[history.length - 1].createdAt),
                      new Date(),
                      { locale: fr }
                    )
                  : "aucune activité"}
              </Text>
            </View>

            <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.text}>
              {history.length > 0
                ? history[history.length - 1].data.text
                : "Écrivez un message pour démarrer une conversation"}
            </Text>
          </View>
        </Surface>
      </TouchableRipple>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 27,
  },
  rightColumn: {
    flex: 1,
    flexDirection: "column",
    height: 64,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Marianne-Bold",
  },
  time: {
    fontSize: 13,
    fontFamily: "Spectral",
  },
  text: {
    fontSize: 13,
    fontFamily: "Spectral",
  },
});
