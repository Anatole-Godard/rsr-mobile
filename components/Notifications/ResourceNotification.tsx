import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Surface,
  Text,
  Avatar,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import color from "color";
import { Notification } from "types/Notification";
import { StarIcon, TrashIcon } from "react-native-heroicons/outline";
import Paragraph from "components/ui/Paragraph";
import { HOST_URL } from "constants/env";
import { notifications } from "./types";
import { Swipeable } from "react-native-gesture-handler";
import { useNotifications } from "hooks/useNotifications";

interface Props extends Notification {
  onPress: () => void;
}
// Todo: link to the resource and swipe to dismiss
export const ResourceNotification = (props: Props) => {
  const theme = useTheme();
  const { removeNotification } = useNotifications();

  const contentColor = color(theme.colors.text).alpha(0.8).rgb().string();

  return (
    <Swipeable
      renderLeftActions={() => (
        <View
          style={{
            backgroundColor: "#FF4F5B",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => removeNotification(props._id)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              width: 156,
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
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableRipple onPress={props.onPress}>
        <Surface style={styles.container}>
          <View style={styles.leftColumn}>
            {/* <StarIcon size={30} color={theme.colors.primary} /> */}
            <Text style={{ fontSize: 32 }}>✨</Text>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.topRow}>
              <Avatar.Image
                style={{ marginRight: 10 }}
                key={props.emitter.uid}
                source={{ uri: HOST_URL + props.emitter.photoURL }}
                size={40}
              />
            </View>
            <Paragraph style={{ marginBottom: 10, fontSize: 13 }}>
              {props.emitter.fullName}{" "}
              {notifications.find((e) => e.type === props.type)?.message}
              {/* {props.document?.name && ` dans ${props.document.name}`} */}
            </Paragraph>
            <Text
              style={{
                color: contentColor,
                fontWeight: "bold",
                fontFamily: "Marianne-Bold",
              }}
            >
              {props.document.data?.attributes.properties.name || "Ressource"}
            </Text>
          </View>
        </Surface>
      </TouchableRipple>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    elevation: 0,
  },
  leftColumn: {
    width: 100,
    marginRight: 10,
    alignItems: "flex-end",
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
