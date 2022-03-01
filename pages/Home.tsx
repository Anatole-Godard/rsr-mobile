import { theme } from "core/theme";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { fetchRSR } from "utils/fetchRSR";

import { Resource } from "types/Resource";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resources/ResourceHome";

import LottieView from "lottie-react-native";
import Paragraph from "components/ui/Paragraph";

import { API_URL } from "constants/env";
import { ChannelHomeHeader } from "components/Channel/ChannelHomeHeader";
import { Separator } from "components/ui/Separator";

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
    const res = await fetchRSR(API_URL + "/resource", user?.session);
    const body = await res.json();
    setResources(
      body.data.attributes
        .filter((r: Resource) => r.validated)
        .sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchData();
  }, []);

  function renderItem({ item }: { item: ResourceHomeProps }) {
    return <ResourceHome {...item} />;
  }

  const listEmptyComponent = () => (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128,
        }}
        source={require("../assets/lotties/empty.json")}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Oh! Il n'y a pas encore de ressources disponibles...
      </Paragraph>
      <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
        Peut-être avez-vous un problème de réseau ?
      </Paragraph>
    </View>
  );

  return (
    <FlatList
      ListEmptyComponent={listEmptyComponent}
      ListHeaderComponent={() => (
        <ChannelHomeHeader navigation={props.navigation} />
      )}
      stickyHeaderIndices={[0]}
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
      ItemSeparatorComponent={Separator}
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
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height / 2,
  },
});
