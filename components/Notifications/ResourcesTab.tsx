import { useNavigation } from "@react-navigation/native";
import { Separator } from "components/ui/Separator";
import { useNotifications } from "hooks/useNotifications";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ResourceNotification } from "./ResourceNotification";
import { v4 as uuidv4 } from "uuid";

export const ResourcesTab = () => {
  const { notifications } = useNotifications();
  const [notificationsResources, setNR] = useState(
    notifications.filter(
      (notification) =>
        notification.type === "comment" || notification.type === "like"
    )
  );

  const { navigate } = useNavigation();

  useEffect(() => {
    return () => {
      setNR([]);
    };
  }, []);
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
    />
  );
};
