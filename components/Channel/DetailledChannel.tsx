import React from "react";

import { usePreferences } from "hooks/usePreferences";
import { StyleSheet, View } from "react-native";
import { theme } from "core/theme";
import { Channel } from "types/Channel";
import { Avatar, Paragraph, Text, Title } from "react-native-paper";
import Color from "color";
import { HOST_URL } from "constants/env";
import { UserMinimum } from "types/User";
import { useAuth } from "hooks/useAuth";

type Props = Channel

export const DetailledChannel = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();
  const contentColor = Color(theme[colorScheme].colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const members = [
    ...props.members,
    {
      uid: user.data.uid,
      photoURL: user.data.photoURL,
      fullName: user.data.fullName,
    },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 8,
        borderRadius: 8,
        paddingBottom: 16,
        backgroundColor: theme[colorScheme].colors.surface,
      }}
    >
      <View style={styles.leftColumn}>
        <Avatar.Image
          style={{ marginTop: 10 }}
          source={{ uri: props.image }}
          size={48}
        />
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.topRow}>
          <Title style={{ fontFamily: "Marianne-ExtraBold" }}>
            {props.name}
          </Title>
        </View>
        <Paragraph
          style={{ color: contentColor, lineHeight: -5, fontSize: 15 }}
        >
          {props.description}
        </Paragraph>

        <View
          style={{
            flexDirection: "row",
            marginLeft: 8,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          {members.map((member: UserMinimum) => (
            <Avatar.Image
              source={{ uri: HOST_URL + member.photoURL }}
              style={{ marginLeft: -8 }}
              size={24}
              key={member.uid}
            />
          ))}
          <Text style={{ fontFamily: "Spectral", fontSize: 14, marginLeft: 8 }}>
            {members.length + (members.length > 1 ? " membres" : " membre")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftColumn: {
    width: 72,
    alignItems: "center",
    // justifyContent: "center",
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
