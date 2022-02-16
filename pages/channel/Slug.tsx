import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ChannelMessage } from "components/Channel/Message";
import { Message } from "types/Message";
import io from "socket.io-client";
import { Channel } from "types/Channel";
import { Navigation } from "types/Navigation";
import { useAuth } from "hooks/useAuth";
import { fetchRSR } from "utils/fetchRSR";
import { API_URL, HOST_URL } from "constants/env";

import { Text, TextInput as PaperInput, useTheme } from "react-native-paper";
import { CheckIcon } from "react-native-heroicons/outline";
import TextInput from "components/ui/TextInput";

interface Props {
  navigation: Navigation;
  route: {
    params: Channel;
  };
}

export const ChannelSlug = (props: Props) => {
  const [chat, setChat] = useState<Message[]>(props.route.params.messages);
  const [message, setMessage] = useState<{ value: string; error: string }>({
    value: "",
    error: "",
  });

  const { user } = useAuth();
  const theme = useTheme();

  useEffect((): any => {
    const socket = io(HOST_URL, {
      path: "/api/channel/[slug]/socket",
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    // update chat on new message dispatched
    socket.on("message", (message: Message) => {
      setChat((oldChat) => [...oldChat, message]);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  const sendMsg = async () => {
    console.log({
      user: {
        fullName: user.data.fullName,
        photoURL: user.data.photoURL,
        uid: user.data.uid,
      },
      data: { type: "message", text: message.value },
    });

    if (user) {
      const resp = await fetchRSR(
        `${API_URL}/channel/${props.route.params.slug}/messages`,
        user?.session,
        {
          method: "POST",
          body: JSON.stringify({
            user: {
              fullName: user.data.fullName,
              photoURL: user.data.photoURL,
              uid: user.data.uid,
            },
            data: { type: "message", text: message.value },
          }),
        }
      );
      if (resp.ok) setMessage({ value: "", error: "" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={56}
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <FlatList
        data={chat}
        renderItem={({ item }) => <ChannelMessage {...item} />}
        keyExtractor={(item: Message) => item._id || item.createdAt.toString()}
      />
      {/* <ScrollView>
        <Text>
          {JSON.stringify(
            chat.map((message) => message.data),
            null,
            2
          )}
        </Text>
      </ScrollView> */}
      <View style={{ width: "100%", paddingBottom: 48 }}>
        <TextInput
          label="Écrire un message"
          returnKeyType="next"
          value={message.value}
          onChangeText={(text) => setMessage({ value: text, error: "" })}
          error={!!message.error}
          errorText={message.error}
          right={
            <PaperInput.Icon
              style={{ marginTop: 14 }}
              onPress={sendMsg}
              icon={() => <CheckIcon size={24} color={theme.colors.primary} />}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
