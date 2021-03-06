import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Surface, Text, Title, TouchableRipple } from 'react-native-paper';
import color from 'color';
import { Resource } from 'types/Resource';
import { usePreferences } from 'hooks/usePreferences';
import { colors, theme } from 'core/theme';

import { API_URL, HOST_URL } from 'constants/env';

import {
  CalendarIcon,
  ChatIcon,
  HandIcon,
  HeartIcon as HeartIconOutline,
  LinkIcon,
  LocationMarkerIcon,
  QuestionMarkCircleIcon
} from 'react-native-heroicons/outline';
import { HeartIcon as HeartIconSolid } from 'react-native-heroicons/solid';

import { formatDistance } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Swipeable } from 'react-native-gesture-handler';
import { UserMinimum } from 'types/User';
import { useAuth } from 'hooks/useAuth';
import { useToast } from 'react-native-paper-toast';
import { fetchRSR } from 'utils/fetchRSR';
import { types, visibilities } from 'constants/resourceTypes';
import { useNavigation } from '@react-navigation/native';

const ResourceDataView = ({
  type,
}: {
  type: 'location' | 'physical_item' | 'external_link' | 'event' | 'other';
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
  if (type === "event")
    style = {
      backgroundColor:
        colorScheme === "light" ? colors.red[100] : colors.red[800],
      borderColor: colors.red[500],
    };
  if (type === "other")
    style = {
      backgroundColor:
        colorScheme === "light" ? colors.gray[100] : colors.gray[800],
      borderColor: colors.gray[500],
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
          size={24}
          color={
            colorScheme === "light" ? colors.indigo[700] : colors.indigo[300]
          }
        />
      )}
      {type === "physical_item" && (
        <HandIcon
          size={24}
          color={
            colorScheme === "light" ? colors.emerald[700] : colors.emerald[300]
          }
        />
      )}
      {type === "external_link" && (
        <LinkIcon
          size={24}
          color={
            colorScheme === "light" ? colors.amber[700] : colors.amber[300]
          }
        />
      )}
      {type === "event" && (
        <CalendarIcon
          size={24}
          color={colorScheme === "light" ? colors.red[700] : colors.red[300]}
        />
      )}
      {type === "other" && (
        <QuestionMarkCircleIcon
          size={24}
          color={colorScheme === "light" ? colors.gray[700] : colors.gray[300]}
        />
      )}
      <Text style={{ fontFamily: "Spectral" }}>
        {types.find((r) => r.value === type)?.label}
      </Text>
    </View>
  );
};

interface Props extends Resource {
  // eslint-disable-next-line no-unused-vars
  onPress: (slug: string) => void;
}

export const ResourceHome = (props: Props) => {
  const { navigate } = useNavigation();
  const { colorScheme } = usePreferences();
  const { user } = useAuth();
  const toaster = useToast();

  // console.log("resource", API_URL, HOST_URL);

  const [likes, setLikes] = useState(props.likes);

  const iconColor = color(theme[colorScheme].colors.text)
    .alpha(0.54)
    .rgb()
    .string();

  const contentColor = color(theme[colorScheme].colors.text)
    .alpha(0.8)
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
          message: `Succ??s`,
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
        message: `Vous devez ??tre connect?? pour liker une ressource`,
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
              J'aime d??j??
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
            <TouchableRipple onPress={() => navigate("Profile", props.owner)}>
              <Avatar.Image
                // style={{  }}
                source={{ uri: HOST_URL + props.owner.photoURL }}
                size={48}
              />
            </TouchableRipple>
            <View
              style={{
                flexDirection: "column",
                width: 32,
                height: 32,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  colorScheme === "light"
                    ? colors.trueGray[100]
                    : colors.trueGray[900],
              }}
            >
              {visibilities
                .find((r) => r.value === props.visibility)
                ?.icon.outline({
                  size: 18,
                  color: theme[colorScheme].colors.secondary,
                })}
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.topRow}>
              <Title style={{ fontFamily: "Marianne-ExtraBold" }}>
                {props.data.attributes.properties.name}
              </Title>
            </View>
            <Text
              style={{
                color: contentColor,
                lineHeight: -5,
                fontSize: 15,
                fontFamily: "Spectral",
                paddingBottom: 8,
              }}
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              {props.description?.trimEnd()}
            </Text>
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
                {user.data.uid === props.owner.uid && (
                  <>
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
                      {props.validated ? "valid??e" : "en attente"}
                    </Caption>
                  </>
                )}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    return;
                  }}
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
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onPress={() => {
                    return;
                  }}
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
    paddingTop: 15,
    paddingRight: 15,
    elevation: 1,
  },
  leftColumn: {
    flexDirection: "column",
    width: 72,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
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
    borderRadius: 16,
    width: "100%",
    height: 64,
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
