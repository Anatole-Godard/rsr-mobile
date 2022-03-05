import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Title,
  Caption,
  Avatar,
  useTheme,
  IconButton,
  Text,
  Button,
  TouchableRipple,
  Portal,
  Dialog,
} from "react-native-paper";
import color from "color";
import { Resource } from "types/Resource";

import { API_URL, HOST_URL } from "constants/env";
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
  ExclamationIcon,
  HeartIcon as HeartIconOutline,
  PencilIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { Comment } from "types/Resource/Comment";
import ViewMoreText from "react-native-view-more-text";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import TextInput from "components/ui/TextInput";
import { colors } from "core/theme";

import { TextInput as PaperInput } from "react-native-paper";
import { usePreferences } from "hooks/usePreferences";
import { ExternalLink } from "./ExternalLink";
import { PhysicalItem } from "./PhysicalItem";
import { Location } from "./Location";
import { Event } from "./Event";
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";

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
  const [commentsLoading, setCommentsLoading] = useState(false);

  const refDeleteSheet = React.useRef();
  const refReportSheet = React.useRef();

  // const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  // const [reportModalVisible, setReportModalVisible] = useState<boolean>(false);

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

  const deleteResource = async () => {
    if (user) {
      const res = await fetchRSR(
        `${API_URL}/resource/${props.slug}/delete`,
        user.session,
        {
          method: "DELETE",
        }
      );
      let current = refDeleteSheet?.current || { close: () => {} };
      current.close();
      if (res.ok) props.navigation.goBack();
    }
  };

  const report = async () => {
    if (user) {
      //TODO:@Anatole-Godard : report resource
      // const res = await fetchRSR(
      //   `${API_URL}/resource/${props.slug}/report`,
      //   user.session,
      //   {
      //     method: "DELETE",
      //   }
      // );
      let current = refReportSheet?.current || { close: () => {} };
      current.close();
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

  const refreshComments = async () => {
    if (user) {
      setCommentsLoading(true);
      const res = await fetchRSR(
        `${API_URL}/resource/${props.slug}`,
        user?.session
      );
      const body = await res.json();
      if (res.ok && body.data) {
        setComments(body?.data.attributes.comments);
      }
      setCommentsLoading(false);
    }
  };

  const contentColor = color(theme.colors.text).alpha(0.8).rgb().string();

  function RenderCommentItem({ item }: { item: Comment }) {
    const refRBSheet = React.useRef();

    const reportComment = async () => {
      //TODO:@Anatole-Godard : report comment
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.background,
            maxWidth: Dimensions.get("window").width - 32,
            width: "100%",
          }}
          onLongPress={() => {
            let current = refRBSheet?.current || { open: () => {} };
            current.open();
          }}
        >
          <View style={{ width: "15%" }}>
            {props.page ? (
              <TouchableRipple
                onPress={() => props.navigation.push("Profile", item.owner)}
              >
                <Avatar.Image
                  style={styles.avatar}
                  source={{ uri: HOST_URL + item.owner.photoURL }}
                  size={32}
                />
              </TouchableRipple>
            ) : (
              <Avatar.Image
                style={styles.avatar}
                source={{ uri: HOST_URL + item.owner.photoURL }}
                size={32}
              />
            )}
          </View>
          <View style={{ width: "75%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Caption style={styles.handle}>{item.owner.fullName}</Caption>
              <Caption style={[styles.handle, styles.dot]}>{"\u2B24"}</Caption>
              <Caption style={styles.handle}>
                {formatDistance(
                  new Date(item.createdAt.toString()),
                  new Date(),
                  {
                    locale: fr,
                  }
                )}
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
          <View style={{ width: "10%" }}>
            <IconButton
              onPress={() => {
                let current = refRBSheet?.current || { open: () => {} };
                current.open();
              }}
              size={18}
              icon={(props) => (
                <ExclamationIcon {...props} color={theme.colors.text} />
              )}
            />
          </View>
        </TouchableOpacity>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.colors.surface,
              flexDirection: "column",
              alignItems: "center",
            },
          }}
        >
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
                <Caption style={[styles.handle, styles.dot]}>
                  {"\u2B24"}
                </Caption>
                <Caption style={styles.handle}>
                  {formatDistance(
                    new Date(item.createdAt.toString()),
                    new Date(),
                    {
                      locale: fr,
                    }
                  )}
                </Caption>
              </View>

              <Paragraph
                style={{
                  fontSize: 13,
                  textAlign: "left",
                }}
              >
                {item.content}
              </Paragraph>
            </View>
          </View>

          <Paragraph
            style={{ lineHeight: 20, marginTop: 12, paddingHorizontal: 10 }}
          >
            Cette action est irréversible. Êtes-vous sûr de vouloir signaler
            cette ressource ?
          </Paragraph>

          <Button
            onPress={reportComment}
            mode="contained"
            style={{
              // marginTop: 12,
              backgroundColor: colors.amber[200],
              // elevation: 0,
              width: "90%",
            }}
            labelStyle={{
              color: colors.amber[700],
            }}
            icon={(props) => (
              <ExclamationIcon color={props.color} size={props.size} />
            )}
          >
            Signaler
          </Button>
        </RBSheet>
      </>
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
        {props.page ? (
          <TouchableRipple
            onPress={() => props.navigation.push("Profile", props.owner)}
          >
            <Avatar.Image
              style={styles.avatar}
              source={{ uri: HOST_URL + props.owner.photoURL }}
              size={60}
            />
          </TouchableRipple>
        ) : (
          <Avatar.Image
            style={styles.avatar}
            source={{ uri: HOST_URL + props.owner.photoURL }}
            size={60}
          />
        )}
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Title
            style={{
              fontFamily: "Marianne-ExtraBold",
              lineHeight: 24,
              width: "100%",
            }}
          >
            {props.data.attributes.properties.name}
          </Title>
          <Caption style={styles.handle}>{props.owner.fullName}</Caption>
        </View>
        {props.page && user.data.uid === props.owner.uid ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              onPress={() =>
                props.navigation.push("ResourceEdit", {
                  slug: props.slug,
                  owner: props.owner,
                  data: props.data,
                  createdAt: props.createdAt,
                  description: props.description,
                  likes: props.likes,
                  comments: props.comments,
                  validated: props.validated,
                  tags: props.tags,
                })
              }
              size={24}
              icon={(props) => (
                <PencilIcon size={props.size} color={props.color} />
              )}
              style={{ marginRight: 6 }}
            ></IconButton>
            <IconButton
              onPress={() => {
                let current = refDeleteSheet?.current || { open: () => {} };
                current.open();
              }}
              size={24}
              icon={(props) => (
                <TrashIcon size={props.size} color={props.color} />
              )}
            ></IconButton>
          </View>
        ) : props.page ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              onPress={() => {
                let current = refReportSheet?.current || { open: () => {} };
                current.open();
              }}
              size={24}
              icon={(props) => (
                <ExclamationIcon size={props.size} color={props.color} />
              )}
            ></IconButton>
          </View>
        ) : null}
      </View>
      <ScrollView style={{ maxHeight: Dimensions.get("screen").height / 5, marginVertical: 12, flex:1 }}>
        <Paragraph
          style={{
            ...styles.content,
            color: contentColor,
            fontSize: 18,
            lineHeight: 24,
          }}
        >
          {props.description}
        </Paragraph>
      </ScrollView>
      <ResourceView {...props} />

      {props.page && (
        <>
          <View style={styles.bottomRow}>
            <View style={styles.bottomRowLeft}>
              <Paragraph
                style={{ lineHeight: 24, fontSize: 13, marginTop: 12 }}
              >
                {formatDistance(
                  new Date(props.createdAt.toString()),
                  new Date(),
                  { locale: fr }
                )}
              </Paragraph>
            </View>
            <View style={styles.bottomRowRight}>
              <IconButton
                style={{ marginRight: -2 }}
                onPress={like}
                color="#FF4F5B"
                size={18}
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
                size={18}
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
                renderItem={(props) => <RenderCommentItem {...props} />}
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
                refreshing={commentsLoading}
                onRefresh={refreshComments}
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

          <RBSheet
            height={500}
            ref={refDeleteSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: theme.colors.surface,
                flexDirection: "column",
                alignItems: "center",
                paddingHorizontal: 24,
                flex: 1,
              },
            }}
          >
            <View style={styles.topRow}>
              <Avatar.Image
                style={styles.avatar}
                source={{ uri: HOST_URL + props.owner.photoURL }}
                size={60}
              />

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Title
                  style={{
                    fontFamily: "Marianne-ExtraBold",
                    lineHeight: 24,
                    width: "100%",
                  }}
                >
                  {props.data.attributes.properties.name}
                </Title>
                <Caption style={styles.handle}>{props.owner.fullName}</Caption>
              </View>
            </View>
            <Paragraph
              style={{
                ...styles.content,
                color: contentColor,
                fontSize: 18,
                lineHeight: 24,
              }}
            >
              {props.description}
            </Paragraph>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.colors.text,
                marginVertical: 12,
                width: "100%",
              }}
            />
            <Paragraph
              style={{ lineHeight: 20, marginTop: 12, paddingHorizontal: 10 }}
            >
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
              cette ressource ?
            </Paragraph>

            <Button
              onPress={report}
              mode="contained"
              style={{
                // marginTop: 12,
                backgroundColor: colors.red[200],
                elevation: 0,
                width: "90%",
                flexDirection: "row",
                alignItems: "center",
              }}
              labelStyle={{
                color: colors.red[700],
              }}
              icon={(props) => (
                <TrashIcon color={props.color} size={props.size} />
              )}
            >
              Supprimer
            </Button>
          </RBSheet>
          <RBSheet
            height={500}
            ref={refReportSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: theme.colors.surface,
                flexDirection: "column",
                alignItems: "center",
                paddingHorizontal: 24,
                flex: 1,
              },
            }}
          >
            <View style={styles.topRow}>
              <Avatar.Image
                style={styles.avatar}
                source={{ uri: HOST_URL + props.owner.photoURL }}
                size={60}
              />

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Title
                  style={{
                    fontFamily: "Marianne-ExtraBold",
                    lineHeight: 24,
                    width: "100%",
                  }}
                >
                  {props.data.attributes.properties.name}
                </Title>
                <Caption style={styles.handle}>{props.owner.fullName}</Caption>
              </View>
            </View>
            <Paragraph
              style={{
                ...styles.content,
                color: contentColor,
                fontSize: 18,
                lineHeight: 24,
              }}
            >
              {props.description}
            </Paragraph>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.colors.text,
                marginVertical: 12,
                width: "100%",
              }}
            />
            <Paragraph
              style={{ lineHeight: 20, marginTop: 12, paddingHorizontal: 10 }}
            >
              Cette action est irréversible. Êtes-vous sûr de vouloir signaler
              cette ressource ?
            </Paragraph>

            <Button
              onPress={report}
              mode="contained"
              style={{
                // marginTop: 12,
                backgroundColor: colors.amber[200],
                elevation: 0,
                flexDirection: "row",
                alignItems: "center",
                width: "90%",
              }}
              labelStyle={{
                color: colors.amber[700],
              }}
              icon={(props) => (
                <ExclamationIcon color={props.color} size={props.size} />
              )}
            >
              Signaler
            </Button>
          </RBSheet>
        </>
      )}
    </View>
  );
};

const ResourceView = (props: Resource) => {
  const { colorScheme } = usePreferences();
  const {
    data: { type, attributes },
  } = props;

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

  return (
    <View
      style={{
        ...style,
        height:
          type === "location"
            ? Dimensions.get("screen").height / 3
            : Dimensions.get("screen").height / 6,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      {type === "external_link" && <ExternalLink {...attributes} />}
      {type === "physical_item" && <PhysicalItem {...attributes} />}
      {type === "location" && <Location {...attributes} />}
      {type === "event" && <Event {...attributes} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    // marginRight: 20,
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
