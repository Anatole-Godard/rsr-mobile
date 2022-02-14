import { theme } from "core/theme";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { fetchRSR } from "utils/fetchRSR";

import { API_URL } from "@env";
import { Resource } from "types/Resource";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resource";

import LottieView from "lottie-react-native";
import Paragraph from "components/ui/Paragraph";

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
    console.log(API_URL);
    const res = await fetchRSR(API_URL + "/resource", user);
    const body = await res.json();
    setResources(
      body.data.attributes.sort(
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
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
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
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height / 2,
  },
});
