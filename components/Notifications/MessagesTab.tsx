import { useNavigation } from "@react-navigation/native";
import { Separator } from "components/ui/Separator";
import { useNotifications } from "hooks/useNotifications";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { MessageNotification } from "./MessageNotification";
import { v4 as uuidv4 } from "uuid";

export const MessagesTab = () => {
  const { notifications } = useNotifications();
  const [notificationsMessage, setNM] = useState(
    notifications.filter(
      (notification) =>
        notification.type === "invite" ||
        notification.type === "mention" ||
        notification.type === "message" ||
        notification.type === "resource_create"
    )
  );
  const { navigate } = useNavigation();

  useEffect(() => {
    return () => {
      setNM([]);
    };
  }, []);

  return (
    <FlatList
      data={notificationsMessage}
      renderItem={({ item }) => (
        <MessageNotification
          {...item}
          onPress={() => {
            navigate("ChannelSlug", { ...item });
          }}
        />
      )}
      keyExtractor={(item) =>
        "message-notification_" + item.createdAt.toString() + "_" + uuidv4()
      }
      ItemSeparatorComponent={Separator}
    />
  );
};
