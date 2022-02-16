import { useAuth } from "hooks/useAuth";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "types/Message";

export interface ChannelMessageProps extends Message {}

export const ChannelMessage = (props: ChannelMessageProps) => {
  const { user } = useAuth();

  const isUser = () => {
    return user.data._id === props.user.uid;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[isUser() ? styles.messageSent : styles.messageReceived]}>
          <Text
            style={[
              isUser() ? styles.userMessageSent : styles.userMessageReceived,
            ]}
          >
            {isUser() ? "Me" : props.user.fullName}
          </Text>
          <View
            style={[
              isUser() ? styles.messageSentBox : styles.messageReceivedBox,
            ]}
          >
            <Text
              style={[
                isUser() ? styles.messageSentText : styles.messageReceivedText,
              ]}
            >
              {props.data.text}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageReceived: {
    alignSelf: "flex-start",
    maxWidth: 70 + "%",
  },
  messageSent: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  messageReceivedBox: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    margin: 10,
    alignSelf: "flex-start",
    maxWidth: 70 + "%",
  },
  messageSentBox: {
    flexDirection: "column",
    alignSelf: "flex-end",
    backgroundColor: "#42a5f5",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    maxWidth: 70 + "%",
  },
  userMessageReceived: {
    fontWeight: "bold",
    color: "#aaa",
  },
  userMessageSent: {
    alignItems: "flex-end",
    fontWeight: "bold",
    color: "#2196f3",
  },
  messageReceivedText: {},
  messageSentText: {
    color: "white",
  },
});
