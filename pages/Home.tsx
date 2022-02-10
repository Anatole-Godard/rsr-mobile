import { theme } from "core/theme";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { fetchRSR } from "utils/fetchRSR";

import { API_URL } from "@env";
import { Resource } from "types/Resource";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resource";

type Props = {
  navigation: Navigation;
};

interface ResourceHomeProps extends Resource {
  onPress: (slug: string) => void;
}

export const HomeScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchRSR(API_URL + "/resource", user);
    const body = await res.json();
    setResources(body.data.attributes);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchData();
  }, []);

  function renderItem({ item }: { item: ResourceHomeProps }) {
    return <ResourceHome {...item} />;
  }

  return (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme[colorScheme].colors.background,
      }}
      style={{ backgroundColor: theme[colorScheme].colors.background }}
      data={resources.map((resource) => ({
        ...resource,
        onPress: () =>
          props.navigation &&
          props.navigation.push("Details", {
            ...resource,
          }),
      }))}
      renderItem={renderItem}
      keyExtractor={(item: ResourceHomeProps) => item.slug.toString()}
      ItemSeparatorComponent={() => (
        <View style={{ height: StyleSheet.hairlineWidth }} />
      )}
      onRefresh={() => fetchData()}
      refreshing={loading}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => fetchData()}
          title="Tirer pour rafraîchir"
          tintColor={
            theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
          }
          titleColor={
            theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
          }
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
});
