import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChatIcon, HeartIcon } from "react-native-heroicons/outline";
import SkeletonContent from "react-native-skeleton-content";

export const Resource_Mobile: React.FC = (props: any) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <SkeletonContent
      containerStyle={{
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        padding: 12,
      }}
      isLoading={loading}
      layout={[
        {
          key: "owner",
          width: "100%",
          height: 48,
          marginBottom: 10,
          borderRadius: 10,
        },
        {
          key: "date",
          width: "40%",
          height: 24,
          marginBottom: 10,
          borderRadius: 10,
        },
        {
          key: "resource",
          width: "100%",
          height: 150,
          marginBottom: 10,
          borderRadius: 10,
        },
        {
          key: "likes",
          right: 0,

          width: "40%",
          height: 24,
          borderRadius: 10,
          marginBottom: 10,
        },
        {
          key: "comment1",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          children: [
            {
              key: "comment1-image",
              width: 48,
              height: 48,
              borderRadius: 24,
            },
            {
              key: "comment1-content",
              children: [
                {
                  key: "comment1-owner",
                  width: "20%",
                  height: 24,
                  borderRadius: 10,
                },{
                  key: "comment1-text",
                  width: "100%",
                  height: 24,
                  borderRadius: 10,
                },
              ],
            },
          ],
        },
      ]}
    >
      <View style={styles.resource}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.owner}>{props?.owner}</Text>
            <Text style={styles.createdAt}>
              posté
              {" " +
                formatDistanceToNow(props?.createdAt, {
                  addSuffix: true,
                  locale: fr,
                })}
            </Text>
          </View>
          <Text>LA RESSOURCE</Text>
          <View style={styles.footer}>
            <HeartIcon size={18} style={{ marginRight: 4 }} />
            <Text style={styles.likes}>{props?.likes}</Text>
            <ChatIcon size={18} style={{ marginRight: 4 }} />

            <Text style={styles.comments}>{props?.comments?.length}</Text>
          </View>
        </View>

        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Commentaires</Text>

          <ScrollView>
            {props?.comments?.map((comment: any, key: number) => (
              <View style={styles.comment} key={key}>
                <Image
                  style={styles.commentOwnerImage}
                  source={{
                    uri: comment?.photoUrl,
                  }}
                />
                <View>
                  <Text style={styles.commentOwner}>{comment.owner}</Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TextInput
            style={styles.commentInput}
            placeholder="Ajouter un commentaire"
          />
        </View>
      </View>
    </SkeletonContent>
  );
};

const styles = StyleSheet.create({
  resource: {
    flexDirection: "column",
    width: Dimensions.get("window").width - 24,
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 256,
    backgroundColor: "#e8e8e8",
    padding: 24,
    borderRadius: 12,
    width: "100%",
  },
  header: {
    marginBottom: 12,
  },
  owner: {
    fontSize: 24,
    fontWeight: "bold",
  },
  createdAt: {
    fontSize: 16,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  likes: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12,
  },
  comments: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentsContainer: {
    flexDirection: "column",
    padding: 12,
    marginTop: 6,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 6,
    padding: 12,
    borderRadius: 12,
    // backgroundColor: "#efefef",
  },
  commentOwner: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentOwnerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  commentContent: {
    fontSize: 14,
  },
  commentInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
});
