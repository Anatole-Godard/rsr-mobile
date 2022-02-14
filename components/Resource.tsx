import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import {
  Surface,
  Title,
  Caption,
  Text,
  Avatar,
  TouchableRipple,
} from "react-native-paper";
import color from "color";
import { Resource } from "types/Resource";
import { usePreferences } from "hooks/usePreferences";
import { colors, theme } from "core/theme";

import { HOST_URL, API_URL } from "@env";
import {
  ChatIcon,
  ExternalLinkIcon,
  HandIcon,
  HeartIcon as HeartIconOutline,
  LocationMarkerIcon,
} from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";

import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import { Swipeable } from "react-native-gesture-handler";
import { UserMinimum } from "types/User";
import { useAuth } from "hooks/useAuth";
import { useToast } from "react-native-paper-toast";
import { fetchRSR } from "utils/fetchRSR";
import Paragraph from "./ui/Paragraph";
import { types } from "constants/resourceTypes";

const ResourceDataView = ({
  type,
}: {
  type: "location" | "physical_item" | "external_link" | string;
}) => {
  const { colorScheme } = usePreferences();
  let style;

  if (type === "location")
    style = {
      backgroundColor:
        colorScheme === "light" ? colors.indigo[100] : colors.indigo[800],
      borderColor: colors.indigo[500],
    };
  if (type === "physical_item")
    style = {
      backgroundColor:
        colorScheme === "light" ? colors.emerald[100] : colors.emerald[800],
      borderColor: colors.emerald[500],
    };
  if (type === "external_link")
    style = {
      backgroundColor:
        colorScheme === "light" ? colors.amber[100] : colors.amber[800],
      borderColor: colors.amber[500],
    };
  return (
    <View
      style={{
        ...styles.image,
        ...style,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {type === "location" && (
        <LocationMarkerIcon
          size={32}
          color={
            colorScheme === "light" ? colors.indigo[700] : colors.indigo[300]
          }
        />
      )}
      {type === "physical_item" && (
        <HandIcon
          size={32}
          color={
            colorScheme === "light" ? colors.emerald[700] : colors.emerald[300]
          }
        />
      )}
      {type === "external_link" && (
        <ExternalLinkIcon
          size={32}
          color={
            colorScheme === "light" ? colors.amber[700] : colors.amber[300]
          }
        />
      )}
      <Text style={{ fontFamily: "Spectral" }}>
        {types.find((r) => r.value === type)?.label}
      </Text>
    </View>
  );
};

interface Props extends Resource {
  onPress: (slug: string) => void;
}

export const ResourceHome = (props: Props) => {
  const { colorScheme } = usePreferences();
  const { user } = useAuth();
  const toaster = useToast();

  const [likes, setLikes] = useState(props.likes);

  const iconColor = color(theme[colorScheme].colors.text)
    .alpha(0.54)
    .rgb()
    .string();

  const contentColor = color(theme[colorScheme].colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme[colorScheme].colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const like = async () => {
    if (user) {
      const res = await fetchRSR(
        `${API_URL}/resource/${props.slug}/like`,
        user.session
      );
      const body = await res.json();
      if (res.ok && body.data) {
        toaster.show({
          message: `Succès`,
          type: "success",
        });
        setLikes(body.data.attributes.likes);
      } else {
        toaster.show({
          message: `${body.error.name} - ${body.error.message}`,
          type: "error",
        });
      }
    } else {
      toaster.show({
        message: `Vous devez être connecté pour liker une ressource`,
        type: "error",
      });
    }
  };

  const rightAction = () => (
    <View
      style={{
        backgroundColor: "#FF4F5B",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <TouchableOpacity
        onPress={like}
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          width: 132,
          flexDirection: "row",
        }}
      >
        {likes.find((u: UserMinimum) => u.uid === user.data.uid) ? (
          <>
            <HeartIconSolid
              size={24}
              color={theme[colorScheme].colors.surface}
            />
            <Text
              style={{
                color: theme[colorScheme].colors.surface,
                marginLeft: 8,
                fontFamily: "Marianne-ExtraBold",
              }}
            >
              J'aime déjà
            </Text>
          </>
        ) : (
          <>
            <HeartIconOutline
              size={24}
              color={theme[colorScheme].colors.surface}
            />
            <Text
              style={{
                color: theme[colorScheme].colors.surface,
                marginLeft: 8,
                fontFamily: "Marianne-ExtraBold",
              }}
            >
              Aimer
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={rightAction}>
      <TouchableRipple onPress={() => props.onPress(props.slug)}>
        <Surface style={styles.container}>
          <View style={styles.leftColumn}>
            <Avatar.Image
              style={{ marginTop: 10 }}
              source={{ uri: HOST_URL + props.owner.photoURL }}
              size={48}
            />
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.topRow}>
              <Title style={{ fontFamily: "Marianne-ExtraBold" }}>
                {props.data.attributes.properties.name}
              </Title>
            </View>
            <Paragraph
              style={{ color: contentColor, lineHeight: -5, fontSize: 15 }}
            >
              {props.description}
            </Paragraph>
            <ResourceDataView type={props.data.type} />
            <View style={styles.bottomRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Caption style={styles.handle}>{props.owner.fullName}</Caption>
                <Caption style={[styles.handle, styles.dot]}>
                  {"\u2B24"}
                </Caption>
                <Caption style={styles.handle}>
                  {formatDistance(
                    new Date(props.createdAt.toString()),
                    new Date(),
                    { locale: fr }
                  )}
                </Caption>
                <Caption style={[styles.handle, styles.dot]}>
                  {"\u2B24"}
                </Caption>
                <Caption
                  style={{
                    color: props.validated
                      ? colors.green[700]
                      : colors.trueGray[500],
                  }}
                >
                  {props.validated ? "validée" : "en attente"}
                </Caption>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {}}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <View style={styles.iconContainer}>
                    <ChatIcon size={14} color={iconColor} />
                    <Caption style={styles.iconDescription}>
                      {props.comments?.length || 0}
                    </Caption>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <View style={styles.iconContainer}>
                    {likes.find((u: UserMinimum) => u.uid === user.data.uid) ? (
                      <HeartIconSolid size={14} color={"#FF4F5B"} />
                    ) : (
                      <HeartIconOutline size={14} color={iconColor} />
                    )}
                    <Caption style={styles.iconDescription}>
                      {likes?.length || 0}
                    </Caption>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Surface>
      </TouchableRipple>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 5,
    paddingRight: 15,
    elevation: 1,
  },
  leftColumn: {
    width: 72,
    alignItems: "center",
    // justifyContent: "center",
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  handle: {
    marginRight: 3,
  },
  dot: {
    fontSize: 3,
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: -5,
    borderRadius: 20,
    width: "100%",
    height: 100,
  },
  bottomRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  iconDescription: {
    marginLeft: 2,
    lineHeight: 12,
  },
});
