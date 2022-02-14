import React, { useState } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import {
  Title,
  Caption,
  Avatar,
  useTheme,
  IconButton,
  Text,
  Button,
} from "react-native-paper";
import color from "color";
import { Resource } from "types/Resource";

import { HOST_URL, API_URL } from "@env";
import { Navigation } from "types/Navigation";
import Paragraph from "components/ui/Paragraph";
import { useAuth } from "hooks/useAuth";
import { fetchRSR } from "utils/fetchRSR";

import { UserMinimum } from "types/User";

import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import {
  ChatIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon as HeartIconOutline,
  PaperAirplaneIcon,
} from "react-native-heroicons/outline";
import { Comment } from "types/Resource/Comment";
import ViewMoreText from "react-native-view-more-text";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import TextInput from "components/ui/TextInput";
import { colors } from "core/theme";

import { TextInput as PaperInput } from "react-native-paper";

interface Props extends Resource {
  navigation: Navigation;
  page?: boolean;
}

export const DetailedResource = (props: Props) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [likes, setLikes] = useState(props.likes);

  const [comments, setComments] = useState<Comment[]>(props.comments || []);
  const [comment, setComment] = useState({ value: "", error: "" });

  const like = async () => {
    if (user) {
      const res = await fetchRSR(
        `${API_URL}/resource/${props.slug}/like`,
        user.session
      );
      const body = await res.json();
      if (res.ok && body.data) setLikes(body.data.attributes.likes);
    }
  };

  const postComment = async () => {
    if (user) {
      const res = await fetchRSR(
        `${API_URL}/resource/${props.slug}/comment`,
        user?.session,
        {
          method: "POST",
          body: JSON.stringify({
            commentContent: comment.value,
          }),
        }
      );
      const body = await res.json();
      if (res.ok && body.data) {
        setComments(body?.data.attributes.comments);
        setComment({ value: "", error: "" });
      }
    }
  };

  const contentColor = color(theme.colors.text).alpha(0.8).rgb().string();

  function renderItem({ item }: { item: Comment }) {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          borderRadius: 8,
          backgroundColor: theme.colors.background,
          maxWidth: Dimensions.get("window").width - 32,
          width: "100%",
        }}
      >
        <View style={{ width: "15%" }}>
          <Avatar.Image
            style={styles.avatar}
            source={{ uri: HOST_URL + item.owner.photoURL }}
            size={32}
          />
        </View>
        <View style={{ width: "85%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Caption style={styles.handle}>{item.owner.fullName}</Caption>
            <Caption style={[styles.handle, styles.dot]}>{"\u2B24"}</Caption>
            <Caption style={styles.handle}>
              {formatDistance(new Date(item.createdAt.toString()), new Date(), {
                locale: fr,
              })}
            </Caption>
          </View>
          <ViewMoreText
            numberOfLines={1}
            renderViewMore={(onPress) => (
              <Button
                icon={(props) => (
                  <ChevronDownIcon color={props.color} size={props.size} />
                )}
                mode="text"
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ justifyContent: "flex-start" }}
                onPress={onPress}
              >
                Voir plus
              </Button>
            )}
            renderViewLess={(onPress) => (
              <Button
                icon={(props) => (
                  <ChevronUpIcon color={props.color} size={props.size} />
                )}
                mode="text"
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ justifyContent: "flex-start" }}
                onPress={onPress}
              >
                Voir moins
              </Button>
            )}
            style={{
              flex: 1,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Paragraph
              style={{
                fontSize: 13,
                textAlign: "left",
              }}
            >
              {item.content}
            </Paragraph>
          </ViewMoreText>
        </View>
      </View>
    );
  }

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Paragraph style={{ marginTop: 16 }}>
        Oh! Il n'y a pas encore de commentaires...
      </Paragraph>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Avatar.Image
          style={styles.avatar}
          source={{ uri: HOST_URL + props.owner.photoURL }}
          size={60}
        />
        <View>
          <Title style={{ fontFamily: "Marianne-ExtraBold" }}>
            {props.data.attributes.properties.name}
          </Title>
          <Caption style={styles.handle}>{props.owner.fullName}</Caption>
        </View>
      </View>
      <Paragraph style={{ ...styles.content, color: contentColor }}>
        {props.description}
      </Paragraph>
      {/* <Image
        source={{ uri: props.image }}
        style={[
          styles.image,
          {
            borderColor: imageBorderColor,
          },
        ]}
      /> */}
      {props.page && (
        <>
          <View style={styles.bottomRow}>
            <View style={styles.bottomRowLeft}></View>
            <View style={styles.bottomRowRight}>
              <IconButton
                style={{ marginRight: -2 }}
                onPress={like}
                color="#FF4F5B"
                icon={
                  likes.find((u: UserMinimum) => u.uid === user?.data.uid)
                    ? (props) => (
                        <HeartIconSolid color={props.color} size={props.size} />
                      )
                    : (props) => (
                        <HeartIconOutline
                          color={props.color}
                          size={props.size}
                        />
                      )
                }
              />
              <Text>{likes.length}</Text>
              <IconButton
                color={colors.trueGray[500]}
                style={{ marginLeft: 12, marginRight: -2 }}
                icon={(props) => (
                  <ChatIcon size={props.size} color={props.color} />
                )}
              />
              <Text>{props.comments?.length}</Text>
            </View>
          </View>
          <View style={{ flex: 1, paddingBottom: 48 }}>
            <View style={{ flex: 1, marginBottom: 6 }}>
              <FlatList
                ListEmptyComponent={listEmptyComponent}
                contentContainerStyle={{
                  backgroundColor: theme.colors.surface,
                }}
                style={{ backgroundColor: theme.colors.surface }}
                data={comments ?? []}
                renderItem={renderItem}
                keyExtractor={(item: Comment, i: number) =>
                  item.owner.uid.toString() + "-" + i.toString()
                }
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: StyleSheet.hairlineWidth,
                      marginVertical: 2,
                    }}
                  />
                )}
              />
            </View>

            <View style={{ width: "100%" }}>
              <TextInput
                label="Écrire un commentaire"
                returnKeyType="next"
                value={comment.value}
                onChangeText={(text) => setComment({ value: text, error: "" })}
                error={!!comment.error}
                errorText={comment.error}
                right={
                  <PaperInput.Icon
                    style={{ marginTop: 14 }}
                    onPress={postComment}
                    icon={() => (
                      <CheckIcon size={24} color={theme.colors.primary} />
                    )}
                  />
                }
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    marginRight: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  handle: {
    marginRight: 3,
    lineHeight: 12,
  },
  content: {
    marginTop: 25,
    fontSize: 20,
    lineHeight: 30,
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 25,
    borderRadius: 20,
    width: "100%",
    height: 280,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.trueGray[300],
  },
  bottomRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    fontSize: 3,
  },
});
