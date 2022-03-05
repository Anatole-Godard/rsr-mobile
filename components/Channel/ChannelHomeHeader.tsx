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

import RBSheet from "react-native-raw-bottom-sheet";
import Paragraph from "components/ui/Paragraph";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    const res = await fetchRSR(API_URL + "/channel", user?.session);
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
  const refRBSheet = React.useRef();

  return (
    <>
      <View style={{ flex: 1, marginRight: 24 }}>
        <TouchableOpacity
          onPress={props.onPress}
          onLongPress={() => {
            let current = refRBSheet?.current || { open: () => {} };
            current.open();
          }}
          style={{
            backgroundColor: theme[colorScheme].colors.surface,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor:
                colorScheme === "light" ? colors.blue[400] : colors.blue[600],
              height: 56,
              width: 56,
              borderRadius: 28,
              padding: 2,
            }}
          >
            <View
              style={{
                backgroundColor: theme[colorScheme].colors.surface,
                padding: 2,
                height: 52,
                width: 52,
                borderRadius: 26,
              }}
            >
              {props.image ? (
                <View
                  style={{
                    ...styles.imageContainer,
                    backgroundColor:
                      colorScheme === "light"
                        ? colors.blue[200]
                        : colors.blue[800],
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
                      colorScheme === "light"
                        ? colors.blue[200]
                        : colors.blue[800],
                  }}
                >
                  <UsersIcon size={16} color={colors.blue[500]} />
                </View>
              )}
            </View>
          </View>

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
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: theme[colorScheme].colors.background,
          },
        }}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => {
                let current = refRBSheet?.current || { close: () => {} };
                current.close();
                props.onPress();
              }}
              style={{
                backgroundColor: theme[colorScheme].colors.background,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    colorScheme === "light"
                      ? colors.blue[400]
                      : colors.blue[600],
                  height: 56,
                  width: 56,
                  borderRadius: 28,
                  padding: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme[colorScheme].colors.background,
                    padding: 2,
                    height: 52,
                    width: 52,
                    borderRadius: 26,
                  }}
                >
                  {props.image ? (
                    <View
                      style={{
                        ...styles.imageContainer,
                        backgroundColor:
                          colorScheme === "light"
                            ? colors.blue[200]
                            : colors.blue[800],
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
                          colorScheme === "light"
                            ? colors.blue[200]
                            : colors.blue[800],
                      }}
                    >
                      <UsersIcon size={16} color={colors.blue[500]} />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontFamily: "Marianne-Bold", fontSize: 18 }}>
                {props.name}
              </Text>
              <Text style={{ fontFamily: "Spectral", fontSize: 13 }}>
                #{props.slug} -{" "}
                {props.members.length.toString() +
                  (props.members.length > 1 ? " membres" : " membre")}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 16,
              paddingLeft: 16,
              paddingBottom: 8,
              marginBottom: 8,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: theme[colorScheme].colors.secondary,
            }}
          >
            <Paragraph>“ {props.description} ”</Paragraph>
          </View>
          <Text style={{ fontFamily: "Spectral" }}>
            Dernier message:{" "}
            {props.messages.length > 0
              ? format(
                  new Date(props.messages[props.messages.length - 1].createdAt),
                  "HH:mm, dd MMM yyyy",
                  { locale: fr }
                ) +
                " de " +
                props.messages[props.messages.length - 1].user.fullName
              : "aucun message."}
          </Text>
        </View>
      </RBSheet>
    </>
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
  sheetContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
