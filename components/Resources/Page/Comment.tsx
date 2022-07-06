import React from "react";

import Paragraph from "components/ui/Paragraph";
import { API_URL, HOST_URL } from 'constants/env';
import { colors } from "core/theme";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationIcon,
} from "react-native-heroicons/outline";
import {
  Avatar,
  Button,
  Caption,
  IconButton,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import ViewMoreText from "react-native-view-more-text";
import { Navigation } from "types/Navigation";
import { Comment } from "types/Resource/Comment";
import { fetchRSR } from '../../../utils/fetchRSR';
import { useAuth } from '../../../hooks/useAuth';


export function RenderCommentItem({
  item,
  navigation,
  resourceId,
}: {
  item: Comment;
  navigation: Navigation;
  resourceId: string;
}) {
  const refRBSheet = useRef();
  const theme = useTheme();
  const { user } = useAuth();

  const reportComment = async () => {
      if (user) {
        await fetchRSR(`${API_URL}/report/create`,
          user?.session,
          {
            method: 'POST',
            body: JSON.stringify({
              type: 'comment',
              documentUid: item.owner.uid,
              context: item.content,
              message: 'Demande de signalement faite sur l\'app mobile',
              link: `/resource/${resourceId}`
            })
          });
        const current = refRBSheet.current || { close: () => {
          return;
        } };
        current.close();
      }
  };

  return (
    <>
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
          <TouchableRipple
            onPress={() => navigation.push("Profile", item.owner)}
          >
            <Avatar.Image
              source={{ uri: HOST_URL + item.owner.photoURL }}
              size={32}
            />
          </TouchableRipple>
        </View>
        <View style={{ width: "75%" }}>
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
        <View style={{ width: "10%", zIndex : 100 }}>
          <IconButton
            onPress={() => {
              const current = refRBSheet?.current || { open: () => {
                return;
              } };
              current.open();
            }}
            size={18}
            icon={(props) => (
              <ExclamationIcon {...props} color={theme.colors.error} />
            )}
          />
        </View>
      </View>
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
            paddingHorizontal: 24,
            flex: 1,
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
              source={{ uri: HOST_URL + item.owner.photoURL }}
              size={32}
            />
          </View>
          <View style={{ width: "85%" }}>
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
          Cette action est irréversible. Êtes-vous sûr de vouloir signaler cette
          ressource ?
        </Paragraph>

        <Button
          onPress={reportComment}
          mode="contained"
          style={{
            backgroundColor: colors.amber[200],
            elevation: 0,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
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

export const listEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Paragraph style={{ marginTop: 16 }}>
      Oh! Il n'y a pas encore de commentaires...
    </Paragraph>
  </View>
);

const styles = StyleSheet.create({
  handle: {
    marginRight: 3,
    lineHeight: 12,
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
