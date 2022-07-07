import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { ChannelMessage } from "components/Channel/Message";
import { Message } from "types/Message";
import io from "socket.io-client";
import { Channel } from "types/Channel";
import { Navigation } from "types/Navigation";
import { useAuth } from "hooks/useAuth";
import { fetchRSR } from "utils/fetchRSR";
import { API_URL, HOST_URL } from "constants/env";

import { Appbar, TextInput as PaperInput, useTheme } from "react-native-paper";
import { CheckIcon, PencilIcon } from "react-native-heroicons/outline";
import TextInput from "components/ui/TextInput";

import LottieView from "lottie-react-native";
import Paragraph from "components/ui/Paragraph";
import { messageValidator } from "core/validators";

interface Props {
  navigation: Navigation;
  route: {
    params: Channel;
  };
}

export const ChannelSlug = (props: Props) => {
  const { user } = useAuth();
  useLayoutEffect(() => {
    if (user && user.data.uid === props.route.params.owner.uid)
      props.navigation.setOptions({
        headerRight: () => (
          <Appbar.Action
            onPress={() =>
              props.navigation.push("ChannelEdit", { ...props.route.params })
            }
            icon={(props) => (
              <PencilIcon size={props.size} color={props.color} />
            )}
          />
        ),
      });
  }, [props.navigation]);

  const [chat, setChat] = useState<Message[]>(props.route.params.messages);
  const [message, setMessage] = useState<{ value: string; error: string }>({
    value: "",
    error: "",
  });

  const theme = useTheme();
  const flatListRef = useRef();
  useEffect(() => {
    const socket = io(HOST_URL, {
      path: "/api/channel/[slug]/socket",
    });

    // update chat on new message dispatched
    socket.on("message", (message: Message) => {
      setChat((oldChat) => [...oldChat, message]);
      const current = flatListRef?.current || { scrollToEnd: (options) => {
          return;
        } };
      current.scrollToEnd({ behavior: 'smooth' });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendMsg = async () => {
    const error = messageValidator(message.value);
    setMessage({ ...message, error });
    if (user && error === "") {
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
      keyboardVerticalOffset={72}
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <FlatList ref={flatListRef}
        data={chat}
        renderItem={({ item }) => (
          <ChannelMessage {...item} channelSlug={props.route.params.slug} />
        )}
        keyExtractor={(item: Message) => item._id || item.createdAt.toString()}
        ListEmptyComponent={() => (
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay={true}
              style={{
                width: 128,
                height: 128,
              }}
              source={require("../../assets/lotties/chat.json")}
            />
            <Paragraph style={{ marginTop: 16 }}>
              Oh! Il n'y a pas encore de messages...
            </Paragraph>
            <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
              Engagez la discussion !
            </Paragraph>
          </View>
        )}
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
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: 128,
  },
});
