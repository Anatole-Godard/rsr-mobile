import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { useAuth } from "hooks/useAuth";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { Message } from "types/Message";

import { theme as coreTheme } from "core/theme";

export interface ChannelMessageProps extends Message {}

export const ChannelMessage = (props: ChannelMessageProps) => {
  const { user } = useAuth();
  return user.data._id === props.user.uid ? (
    <SentMessage {...props} />
  ) : (
    <ReceivedMessage {...props} />
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

const SentMessage = (props: Message) => {
  const theme = useTheme();
  return (
    <View
      style={{
        marginBottom: 10,
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
    </View>
  );
};

const ReceivedMessage = (props: Message) => {
  const theme = useTheme();

  return (
    <View
      style={{
        marginBottom: 10,
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
    </View>
  );
};
