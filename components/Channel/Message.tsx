/* eslint-disable @typescript-eslint/no-empty-function */
import { format, formatDistance } from 'date-fns';
import fr from "date-fns/locale/fr";
import { useAuth } from "hooks/useAuth";
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Button, Caption, useTheme } from 'react-native-paper';
import { Message } from "types/Message";

import { colors } from 'core/theme';
import { ExclamationIcon } from 'react-native-heroicons/outline';
import RBSheet from 'react-native-raw-bottom-sheet';
import { API_URL, HOST_URL } from '../../constants/env';
import Paragraph from '../ui/Paragraph';
import { fetchRSR } from '../../utils/fetchRSR';

export interface ChannelMessageProps extends Message {
  channelSlug: string;
}

export interface ChannelMessageDetailsProps extends Message {
  reportMessage: () => Promise<void>;
}

export const ChannelMessage = (props: ChannelMessageProps) => {
  const { user } = useAuth();

  const reportMessage = async () => {
    if (user) {
      return await fetchRSR(`${API_URL}/report/create`,
        user?.session,
        {
          method: 'POST',
          body: JSON.stringify({
            type: 'user',
            documentUid: props.user.uid,
            context: props.data.text,
            message: 'Demande de signalement faite sur l\'app mobile',
            link: `/channel/${props.channelSlug}`
          })
        });
    }
    return null
  };

  return user.data._id === props.user.uid ? (
    <SentMessage {...props} reportMessage={()=>reportMessage()}/>
  ) : (
    <ReceivedMessage {...props} reportMessage={()=>reportMessage()}/>
  );
};

const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: "absolute",
    // backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: "absolute",
    backgroundColor: "#dedede",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: "absolute",
    // backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
});

const SentMessage = (props: ChannelMessageDetailsProps) => {
  const theme = useTheme();
  const refRBSheet = useRef();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        marginBottom: 10,
      }}
      onLongPress={() => {
      const current = refRBSheet?.current || { open: () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      } };
      current.open();
    }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: "2 %",
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={{
            textAlign: "right",
            fontSize: 13,
            color: theme.colors.text,
            // fontWeight: "bold",
            fontFamily: "Marianne",
          }}
        >
          {props.user.fullName.split(" ")[0]}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Spectral",
            color: (theme.colors as unknown as { secondary: string }).secondary,

            marginTop: 3,
          }}
        >
          {" · "}
          {format(
            new Date(props.createdAt),
            new Date(props.createdAt).getDate() === new Date().getDate()
              ? "HH:mm"
              : "HH:mm, dd MMM yyyy",
            {
              locale: fr,
            }
          )}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: 10,
          marginLeft: "45%",
          // borderRadius: 5,

          marginTop: 5,
          marginRight: "2%",
          maxWidth: "50%",
          alignSelf: "flex-end",
          borderRadius: 20,
        }}
        key={props._id}
      >
        <Text style={{ fontSize: 16, color: "#fff" }} key={props._id}>
          {" "}
          {props.data.text}
        </Text>

        <View
          style={{
            ...styles.rightArrow,
            backgroundColor: theme.colors.primary,
          }}
        ></View>
        <View
          style={{
            ...styles.rightArrowOverlap,
            backgroundColor: theme.colors.background,
          }}
        ></View>
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
            flexDirection: 'column',
            alignItems: 'center',
            paddingHorizontal: 24,
            flex: 1
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.background,
            maxWidth: Dimensions.get('window').width - 32,
            width: '100%'
          }}
        >
          <View style={{ width: '15%' }}>
            <Avatar.Image
              source={{ uri: HOST_URL + props.user.photoURL }}
              size={32}
            />
          </View>
          <View style={{ width: '85%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Caption style={{ marginRight: 3, lineHeight: 12 }}>{props.user.fullName}</Caption>
              <Caption style={{ marginRight: 3, lineHeight: 12, fontSize: 3 }}>{'\u2B24'}</Caption>
              <Caption style={{ marginRight: 3, lineHeight: 12 }}>
                {formatDistance(
                  new Date(props.createdAt.toString()),
                  new Date(),
                  {
                    locale: fr
                  }
                )}
              </Caption>
            </View>

            <Paragraph
              style={{
                fontSize: 13,
                textAlign: 'left'
              }}
            >
              {props.data.text}
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
          onPress={async () => {
            await props.reportMessage();
            const current = refRBSheet?.current || { close: () => {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
            } };
            current.close();
          }}
          mode='contained'
          style={{
            backgroundColor: colors.amber[200],
            elevation: 0,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}
          labelStyle={{
            color: colors.amber[700]
          }}
          icon={(props) => (
            <ExclamationIcon color={props.color} size={props.size} />
          )}
        >
          Signaler
        </Button>
      </RBSheet>
    </TouchableOpacity>
  );
};

const ReceivedMessage = (props: ChannelMessageDetailsProps) => {
  const theme = useTheme();
  const refRBSheet = useRef();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        marginBottom: 10,
      }}
      onLongPress={() => {
        const current = refRBSheet?.current || { open: () => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        } };
        current.open();
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            textAlign: "left",
            marginLeft: "5%",
            color: theme.colors.text,
            fontFamily: "Marianne",
            // fontWeight: "bold",
          }}
        >
          {props.user.fullName.split(" ")[0]}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Spectral",
            marginTop: 3,
            color: (theme.colors as unknown as { secondary: string }).secondary,
          }}
        >
          {" · "}
          {format(
            new Date(props.createdAt),
            new Date(props.createdAt).getDate() === new Date().getDate()
              ? "HH:mm"
              : "HH:mm, dd MMM yyyy",
            {
              locale: fr,
            }
          )}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#dedede",
          padding: 10,
          // borderRadius: 5,
          marginTop: 5,
          marginLeft: "2%",
          maxWidth: "70%",
          alignSelf: "flex-start",
          //maxWidth: 500,
          //padding: 14,

          //alignItems:"center",
          borderRadius: 20,
        }}
        key={props._id}
      >
        <Text
          style={{ fontSize: 16, color: "#000", justifyContent: "center" }}
          key={props._id}
        >
          {" "}
          {props.data.text}
        </Text>
        <View style={styles.leftArrow}></View>
        <View
          style={{
            ...styles.leftArrowOverlap,
            backgroundColor: theme.colors.background,
          }}
        ></View>
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
            flexDirection: 'column',
            alignItems: 'center',
            paddingHorizontal: 24,
            flex: 1
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.background,
            maxWidth: Dimensions.get('window').width - 32,
            width: '100%'
          }}
        >
          <View style={{ width: '15%' }}>
            <Avatar.Image
              source={{ uri: HOST_URL + props.user.photoURL }}
              size={32}
            />
          </View>
          <View style={{ width: '85%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Caption style={{ marginRight: 3, lineHeight: 12 }}>{props.user.fullName}</Caption>
              <Caption style={{ marginRight: 3, lineHeight: 12, fontSize: 3 }}>{'\u2B24'}</Caption>
              <Caption style={{ marginRight: 3, lineHeight: 12 }}>
                {formatDistance(
                  new Date(props.createdAt.toString()),
                  new Date(),
                  {
                    locale: fr
                  }
                )}
              </Caption>
            </View>

            <Paragraph
              style={{
                fontSize: 13,
                textAlign: 'left'
              }}
            >
              {props.data.text}
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
          onPress={async () => {
            await props.reportMessage();
            // eslint-disable-next-line no-empty-function
            const current = refRBSheet?.current || { close: () => {} };
            current.close();
          }}
          mode='contained'
          style={{
            backgroundColor: colors.amber[200],
            elevation: 0,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}
          labelStyle={{
            color: colors.amber[700]
          }}
          icon={(props) => (
            <ExclamationIcon color={props.color} size={props.size} />
          )}
        >
          Signaler
        </Button>
      </RBSheet>
    </TouchableOpacity>
  );
};