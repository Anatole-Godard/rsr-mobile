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
import { useAuth } from "hooks/useAuth";
import { fetchRSR } from "utils/fetchRSR";
import { API_URL } from "constants/env";

export const MessagesTab = () => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useNotifications();
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

  const fetchChannel = async (slug: string) => {
    const res = await fetchRSR(`${API_URL}/channel/${slug}`, user?.session);
    const body = await res.json();
    return body;
  };

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
          width: 256,
          height: 256,
        }}
        source={require("../../assets/lotties/notifications.json")}
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
            fetchChannel(item.document.slug).then((res) => {
              removeNotification(item._id);
              navigate("ChannelSlug", { ...res.data.attributes });
            });
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
