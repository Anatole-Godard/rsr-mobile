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

export const ResourcesTab = () => {
  const { notifications } = useNotifications();
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
          width: 128,
          height: 128,
        }}
        source={require("../../assets/lotties/empty.json")}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Pas de commentaires ni de like pour le moment.
      </Paragraph>
    </View>
  );

  return (
    <FlatList
      data={notificationsResources}
      renderItem={({ item }) => (
        <ResourceNotification
          {...item}
          onPress={() => {
            navigate("Details", { ...item });
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
