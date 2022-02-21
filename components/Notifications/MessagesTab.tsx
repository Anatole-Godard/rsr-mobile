import { useNavigation } from "@react-navigation/native";
import { Separator } from "components/ui/Separator";
import { useNotifications } from "hooks/useNotifications";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { MessageNotification } from "./MessageNotification";
import { v4 as uuidv4 } from "uuid";
import { Notification } from "types/Notification";

import LottieView from "lottie-react-native";
import Paragraph from "components/ui/Paragraph";

export const MessagesTab = () => {
  const { notifications } = useNotifications();
  const [notificationsMessage, setNM] = useState<Notification[]>([]);
  const { navigate } = useNavigation();

  useEffect(() => {
    setNM(
      notifications.filter(
        (notification) =>
          notification.type === "invite" ||
          notification.type === "mention" ||
          notification.type === "message" ||
          notification.type === "resource_create"
      )
    );
    return () => {
      setNM([]);
    };
  }, []);

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 128,
      }}
    >
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128,
        }}
        source={require("../../assets/lotties/empty.json")}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Pas de messages pour le moment.
      </Paragraph>
      <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
        Commencez des discussions avec vos amis !
      </Paragraph>
    </View>
  );

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
      ListEmptyComponent={listEmptyComponent}
    />
  );
};
