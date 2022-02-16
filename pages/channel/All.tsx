import { ChannelItem, ChannelItemProps } from "components/Channel/ChannelItem";
import { API_URL } from "constants/env";
import { theme } from "core/theme";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Paragraph } from "react-native-paper";
import { Channel } from "types/Channel";
import { Navigation } from "types/Navigation";
import { fetchRSR } from "utils/fetchRSR";
import LottieView from "lottie-react-native";

interface Props {
  navigation: Navigation;
}

export const ChannelScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchRSR(API_URL + "/channel", user);
    const body = await res.json();
    setChannels(body.data.attributes);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchData();
  }, []);

  const listEmptyComponent = () => (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128,
        }}
        source={require("../../assets/lotties/empty.json")}
        
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
    // <></>
    <FlatList
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={{
        backgroundColor: theme[colorScheme].colors.background,
      }}
      style={{ backgroundColor: theme[colorScheme].colors.background }}
      data={channels.map((channel) => ({
        ...channel,
        onPress: () =>
          props.navigation &&
          props.navigation.push("ChannelSlug", {
            ...channel,
          }),
      }))}
      renderItem={({ item }: { item: ChannelItemProps }) => (
        <ChannelItem {...item} />
      )}
      keyExtractor={(item: ChannelItemProps) => item.slug.toString()}
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
