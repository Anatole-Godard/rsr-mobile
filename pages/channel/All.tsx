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
import { Searchbar } from "react-native-paper";
import { Channel } from "types/Channel";
import { Navigation } from "types/Navigation";
import { fetchRSR } from "utils/fetchRSR";
import LottieView from "lottie-react-native";
import { useSearch } from "hooks/useSearch";

import Paragraph from "components/ui/Paragraph";

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
        Il n'y a pas encore de salons dans le coin...
      </Paragraph>
      <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
        Peut-être avez-vous un problème de réseau ?
      </Paragraph>
    </View>
  );

  const { search, onChange, filtered } = useSearch("slug", channels);

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Rechercher un salon"
        onChangeText={onChange}
        value={search}
        style={{
          fontFamily: "Spectral",
          elevation: 0,
          backgroundColor: theme[colorScheme].colors.surface,
          borderRadius: 0,
          
        }}
      />
      <FlatList
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          backgroundColor: theme[colorScheme].colors.background,
        }}
        style={{ backgroundColor: theme[colorScheme].colors.background }}
        data={filtered
          .sort((a: Channel, b: Channel) => {
            if (a.messages.length === 0) return 1;
            if (b.messages.length === 0) return -1;
            return (
              new Date(b.messages[b.messages.length - 1].createdAt).getTime() -
              new Date(a.messages[a.messages.length - 1].createdAt).getTime()
            );
          })
          .map((channel) => ({
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
    </View>
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
