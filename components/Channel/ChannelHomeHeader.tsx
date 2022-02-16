import { API_URL, HOST_URL } from "constants/env";
import { colors, theme } from "core/theme";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { UsersIcon } from "react-native-heroicons/outline";
import { Text } from "react-native-paper";
import { Channel } from "types/Channel";
import { Navigation } from "types/Navigation";
import { fetchRSR } from "utils/fetchRSR";

interface Props {
  navigation: Navigation;
}

interface ChannelHomeProps extends Channel {
  onPress: () => void;
}

export const ChannelHomeHeader = (props: Props) => {
  const { colorScheme } = usePreferences();
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <FlatList
      horizontal
      contentContainerStyle={{
        backgroundColor: theme[colorScheme].colors.surface,
      }}
      style={{
        backgroundColor: theme[colorScheme].colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      data={channels.map((channel) => ({
        ...channel,
        onPress: () =>
          props.navigation &&
          props.navigation.push("ChannelSlug", {
            ...channel,
          }),
      }))}
      renderItem={({ item }: { item: ChannelHomeProps }) => (
        <ChannelHome {...item} />
      )}
      keyExtractor={(item: Channel) => item.slug.toString()}
    />
  );
};

// instagram story like component
const ChannelHome = (props: ChannelHomeProps) => {
  const { colorScheme } = usePreferences();
  return (
    <View style={{ flex: 1, marginRight: 24 }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          backgroundColor: theme[colorScheme].colors.surface,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.image ? (
          <View
            style={{
              ...styles.imageContainer,
              backgroundColor:
                colorScheme === "light" ? colors.blue[200] : colors.blue[800],
            }}
          >
            <Image
              source={{ uri: HOST_URL + props.image.url }}
              style={styles.image}
            />
          </View>
        ) : (
          <View
            style={{
              ...styles.imageContainer,
              backgroundColor:
                colorScheme === "light" ? colors.blue[200] : colors.blue[800],
            }}
          >
            <UsersIcon size={16} color={colors.blue[500]} />
          </View>
        )}

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 13,
            fontFamily: "Marianne-Bold",
            width: 40,
            height: 24,
            textAlign: "center",
          }}
        >
          {props.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 24,
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
