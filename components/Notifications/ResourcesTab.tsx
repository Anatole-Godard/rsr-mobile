import { useNavigation } from "@react-navigation/native";
import { Separator } from "components/ui/Separator";
import { useNotifications } from "hooks/useNotifications";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ResourceNotification } from "./ResourceNotification";
import { v4 as uuidv4 } from "uuid";
import { Notification } from "types/Notification";

import LottieView from "lottie-react-native";
import Paragraph from "components/ui/Paragraph";
import { API_URL } from "constants/env";
import { fetchRSR } from "utils/fetchRSR";
import { useAuth } from "hooks/useAuth";

export const ResourcesTab = () => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useNotifications();
  const [notificationsResources, setNR] = useState<Notification[]>([]);

  const { navigate } = useNavigation();

  useEffect(() => {
    setNR(
      notifications.filter(
        (notification) =>
          notification.type === "comment" || notification.type === "like"
      )
    );
    return () => {
      setNR([]);
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
          width: 256,
          height: 256,
        }}
        source={require("../../assets/lotties/notifications.json")}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Pas de commentaires ni de like pour le moment.
      </Paragraph>
    </View>
  );

  const fetchResource = async (slug: string) => {
    const res = await fetchRSR(`${API_URL}/resource/${slug}`, user?.session);
    const body = await res.json();
    return body;
  };

  return (
    <FlatList
      data={notificationsResources}
      renderItem={({ item }) => (
        <ResourceNotification
          {...item}
          onPress={() => {
            fetchResource(item.document.slug).then((res) => {
              removeNotification(item._id);
              navigate("Details", { ...res.data.attributes });
            });
          }}
        />
      )}
      keyExtractor={(item) =>
        "resource-notification_" + item.createdAt.toString() + "_" + uuidv4()
      }
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={listEmptyComponent}
    />
  );
};
